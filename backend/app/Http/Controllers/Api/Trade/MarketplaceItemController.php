<?php

namespace App\Http\Controllers\Api\Trade;

use App\Http\Controllers\Api\Concerns\HandlesImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trade\StoreMarketplaceItemRequest;
use App\Http\Resources\MarketplaceItemResource;
use App\Models\ItemImage;
use App\Models\MarketplaceItem;
use App\Support\Catalog;
use App\Support\Nearby;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class MarketplaceItemController extends Controller
{
    use HandlesImages;

    private const PER_PAGE = 20;

    public function index(Request $request): AnonymousResourceCollection
    {
        $category = $request->query('category');

        $query = MarketplaceItem::with(['seller.kycVerification', 'images'])
            ->active()
            ->when($category, function ($query, $category) {
                if ($category === 'all') {
                    return;
                }
                // "rentals" is a type of listing, not a product category.
                if ($category === 'rentals') {
                    $query->where('listing_type', 'rent');
                } elseif ($category === 'tools') {
                    $query->whereIn('category', ['tools', 'tvet_tools']);
                } else {
                    $query->where('category', $category);
                }
            })
            ->when($request->query('type'), fn ($q, $type) => $q->where('listing_type', $type))
            ->when($request->query('location'), fn ($q, $location) => $q->where('location', $location))
            ->when($request->query('max_price'), fn ($q, $max) => $q->where('price', '<=', (int) $max))
            ->when($request->query('condition'), fn ($q, $condition) => $q->where('condition', $condition))
            ->when($request->boolean('urgent'), fn ($q) => $q->where('is_urgent', true))
            ->when($request->query('q'), function ($q, $term) {
                $like = '%'.addcslashes(trim($term), '%_\\').'%';
                $q->where(function ($inner) use ($like) {
                    $inner->where('title', 'like', $like)->orWhere('description', 'like', $like);
                });
            });

        if (Nearby::wanted($request)) {
            return MarketplaceItemResource::collection(Nearby::paginate($query->latest(), $request, self::PER_PAGE));
        }

        match ($request->query('sort')) {
            'price_asc' => $query->orderBy('price')->orderByDesc('id'),
            'price_desc' => $query->orderByDesc('price')->orderByDesc('id'),
            default => $query->latest('id'),
        };

        return MarketplaceItemResource::collection($query->paginate(self::PER_PAGE)->withQueryString());
    }

    public function store(StoreMarketplaceItemRequest $request): JsonResponse
    {
        $type = $request->validated('listing_type') ?? 'sale';

        $item = MarketplaceItem::create([
            'seller_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'price' => $request->validated('price'),
            'category' => $request->validated('category'),
            'condition' => $request->validated('condition'),
            'listing_type' => $type,
            'rent_period' => $type === 'rent' ? $request->validated('rent_period') : null,
            'location' => $request->validated('location'),
            'latitude' => $request->validated('latitude'),
            'longitude' => $request->validated('longitude'),
            'is_urgent' => $request->boolean('is_urgent'),
            'status' => 'active',
        ]);

        $item->load(['seller.kycVerification', 'images']);

        return response()->json([
            'message' => 'Marketplace item listed successfully',
            'data' => new MarketplaceItemResource($item),
        ], 201);
    }

    public function show(MarketplaceItem $item): MarketplaceItemResource
    {
        $item->load(['seller.kycVerification', 'images']);

        return new MarketplaceItemResource($item);
    }

    public function update(Request $request, MarketplaceItem $item): JsonResponse
    {
        if ($item->seller_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'price' => ['sometimes', 'integer', 'min:100'],
            'category' => ['sometimes', Rule::in(Catalog::ITEM_CATEGORIES)],
            'condition' => ['sometimes', Rule::in(Catalog::CONDITIONS)],
            'listing_type' => ['sometimes', Rule::in(Catalog::LISTING_TYPES)],
            'rent_period' => ['nullable', Rule::in(Catalog::RENT_PERIODS)],
            'location' => ['nullable', 'string', 'max:100'],
            'is_urgent' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:active,pending,sold,archived'],
        ]);

        $item->update($validated);
        $item->load(['seller.kycVerification', 'images']);

        return response()->json([
            'message' => 'Item updated successfully',
            'data' => new MarketplaceItemResource($item),
        ]);
    }

    public function destroy(Request $request, MarketplaceItem $item): JsonResponse
    {
        if ($item->seller_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json([
            'message' => 'Item removed successfully',
        ]);
    }

    public function storeImages(Request $request, MarketplaceItem $item): JsonResponse
    {
        return $this->addImages($request, $item, $item->seller_id);
    }

    public function destroyImage(Request $request, MarketplaceItem $item, ItemImage $image): JsonResponse
    {
        return $this->removeImage($request, $item, $item->seller_id, $image);
    }
}
