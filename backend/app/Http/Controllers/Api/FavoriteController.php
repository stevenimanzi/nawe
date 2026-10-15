<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HousingListingResource;
use App\Http\Resources\MarketplaceItemResource;
use App\Models\Favorite;
use App\Models\HousingListing;
use App\Models\MarketplaceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /** Saved listings with full details, for the wishlist page. */
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()->favorites()->latest('id')->get();

        $itemIds = $favorites->where('favoritable_type', MarketplaceItem::class)->pluck('favoritable_id');
        $listingIds = $favorites->where('favoritable_type', HousingListing::class)->pluck('favoritable_id');

        $items = MarketplaceItem::with(['seller.kycVerification', 'images'])->whereIn('id', $itemIds)->get();
        $listings = HousingListing::with(['landlord.kycVerification', 'amenities', 'images'])->whereIn('id', $listingIds)->get();

        return response()->json([
            'data' => [
                'items' => MarketplaceItemResource::collection($items),
                'listings' => HousingListingResource::collection($listings),
            ],
        ]);
    }

    /** Just the keys, so every card can show whether it is saved without loading everything. */
    public function ids(Request $request): JsonResponse
    {
        $ids = $request->user()->favorites()->get()->map(fn (Favorite $f) => [
            'type' => $f->favoritable_type === HousingListing::class ? 'housing_listing' : 'marketplace_item',
            'id' => $f->favoritable_id,
        ]);

        return response()->json(['data' => $ids]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:housing_listing,marketplace_item'],
            'id' => ['required', 'integer'],
        ]);

        $class = $this->classFor($data['type']);

        if (! $class::whereKey($data['id'])->exists()) {
            return response()->json(['message' => 'This listing no longer exists.'], 404);
        }

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'favoritable_type' => $class,
            'favoritable_id' => $data['id'],
        ]);

        return response()->json(['message' => 'Saved to your wishlist'], 201);
    }

    public function destroy(Request $request, string $type, int $id): JsonResponse
    {
        if (! in_array($type, ['housing_listing', 'marketplace_item'], true)) {
            return response()->json(['message' => 'Unknown listing type'], 422);
        }

        $request->user()->favorites()
            ->where('favoritable_type', $this->classFor($type))
            ->where('favoritable_id', $id)
            ->delete();

        return response()->json(['message' => 'Removed from your wishlist']);
    }

    private function classFor(string $type): string
    {
        return $type === 'housing_listing' ? HousingListing::class : MarketplaceItem::class;
    }
}
