<?php

namespace App\Http\Controllers\Api\Dwell;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dwell\StoreHousingListingRequest;
use App\Http\Resources\HousingListingResource;
use App\Models\HousingAmenity;
use App\Models\HousingListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HousingListingController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $listings = HousingListing::with(['landlord.verification', 'amenities', 'images'])
            ->available()
            ->when($request->query('max_rent'), function ($query, $maxRent) {
                $query->where('monthly_rent', '<=', $maxRent);
            })
            ->when($request->query('rooms'), function ($query, $rooms) {
                $query->where('rooms', $rooms);
            })
            ->latest()
            ->paginate(15);

        return HousingListingResource::collection($listings);
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

        $listing->load(['landlord.verification', 'amenities', 'images']);

        return response()->json([
            'message' => 'Housing listing created successfully',
            'data' => new HousingListingResource($listing),
        ], 201);
    }

    public function show(HousingListing $listing): HousingListingResource
    {
        $listing->load(['landlord.verification', 'amenities', 'images']);

        return new HousingListingResource($listing);
    }

    public function update(Request $request, HousingListing $listing): JsonResponse
    {
        if ($listing->landlord_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'monthly_rent' => ['sometimes', 'integer', 'min:5000'],
            'deposit' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'in:available,rented,paused'],
        ]);

        $listing->update($validated);
        $listing->load(['landlord.verification', 'amenities', 'images']);

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
}
