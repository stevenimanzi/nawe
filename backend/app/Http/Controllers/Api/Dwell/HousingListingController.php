<?php

namespace App\Http\Controllers\Api\Dwell;

use App\Http\Controllers\Api\Concerns\HandlesImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dwell\StoreHousingListingRequest;
use App\Http\Resources\HousingListingResource;
use App\Models\HousingAmenity;
use App\Models\HousingListing;
use App\Models\ItemImage;
use App\Support\Catalog;
use App\Support\Nearby;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class HousingListingController extends Controller
{
    use HandlesImages;

    private const PER_PAGE = 15;

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = HousingListing::with(['landlord.kycVerification', 'amenities', 'images'])
            ->available()
            ->when($request->query('max_rent'), fn ($q, $max) => $q->where('monthly_rent', '<=', (int) $max))
            ->when($request->query('rooms'), function ($q, $rooms) {
                // The "4+" option sends 4.
                (int) $rooms >= 4 ? $q->where('rooms', '>=', 4) : $q->where('rooms', (int) $rooms);
            })
            ->when($request->query('location'), fn ($q, $location) => $q->where('location', $location))
            ->when($request->query('property_type'), fn ($q, $type) => $q->where('property_type', $type))
            ->when($request->query('q'), function ($q, $term) {
                $like = '%'.addcslashes(trim($term), '%_\\').'%';
                $q->where(function ($inner) use ($like) {
                    $inner->where('title', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('address', 'like', $like);
                });
            });

        // amenities=water,wifi → every listed amenity must be present.
        $wanted = array_filter(explode(',', (string) $request->query('amenities')));
        foreach ($wanted as $key) {
            if ($column = Catalog::AMENITY_COLUMNS[$key] ?? null) {
                $query->whereHas('amenities', fn ($q) => $q->where($column, true));
            }
        }

        // The map asks for up to 100 at once; the list view uses the default page size.
        $perPage = min(100, max(1, (int) $request->query('per_page', self::PER_PAGE)));

        if (Nearby::wanted($request)) {
            return HousingListingResource::collection(Nearby::paginate($query->latest(), $request, $perPage));
        }

        match ($request->query('sort')) {
            'rent_asc' => $query->orderBy('monthly_rent')->orderByDesc('id'),
            'rent_desc' => $query->orderByDesc('monthly_rent')->orderByDesc('id'),
            default => $query->latest('id'),
        };

        return HousingListingResource::collection($query->paginate($perPage)->withQueryString());
    }

    public function store(StoreHousingListingRequest $request): JsonResponse
    {
        $listing = HousingListing::create([
            'landlord_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'monthly_rent' => $request->validated('monthly_rent'),
            'deposit' => $request->validated('deposit'),
            'rooms' => $request->validated('rooms'),
            'latitude' => $request->validated('latitude'),
            'longitude' => $request->validated('longitude'),
            'address' => $request->validated('address'),
            'location' => $request->validated('location'),
            'property_type' => $request->validated('property_type') ?? 'room',
            'status' => 'available',
        ]);

        HousingAmenity::create([
            'housing_listing_id' => $listing->id,
            'has_water' => $request->boolean('has_water'),
            'has_wifi' => $request->boolean('has_wifi'),
            'has_electricity' => $request->boolean('has_electricity'),
            'has_parking' => $request->boolean('has_parking'),
            'is_furnished' => $request->boolean('is_furnished'),
            'distance_to_campus_meters' => $request->validated('distance_to_campus_meters'),
        ]);

        $listing->load(['landlord.kycVerification', 'amenities', 'images']);

        return response()->json([
            'message' => 'Housing listing created successfully',
            'data' => new HousingListingResource($listing),
        ], 201);
    }

    public function show(HousingListing $listing): HousingListingResource
    {
        $listing->load(['landlord.kycVerification', 'amenities', 'images']);

        return new HousingListingResource($listing);
    }

    public function update(Request $request, HousingListing $listing): JsonResponse
    {
        if ($listing->landlord_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'monthly_rent' => ['sometimes', 'integer', 'min:5000'],
            'deposit' => ['sometimes', 'integer', 'min:0'],
            'rooms' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:100'],
            'property_type' => ['sometimes', Rule::in(Catalog::PROPERTY_TYPES)],
            'status' => ['sometimes', 'in:available,rented,paused'],
        ]);

        $listing->update($validated);
        $listing->load(['landlord.kycVerification', 'amenities', 'images']);

        return response()->json([
            'message' => 'Listing updated successfully',
            'data' => new HousingListingResource($listing),
        ]);
    }

    public function destroy(Request $request, HousingListing $listing): JsonResponse
    {
        if ($listing->landlord_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json([
            'message' => 'Listing removed successfully',
        ]);
    }

    public function storeImages(Request $request, HousingListing $listing): JsonResponse
    {
        return $this->addImages($request, $listing, $listing->landlord_id);
    }

    public function destroyImage(Request $request, HousingListing $listing, ItemImage $image): JsonResponse
    {
        return $this->removeImage($request, $listing, $listing->landlord_id, $image);
    }
}
