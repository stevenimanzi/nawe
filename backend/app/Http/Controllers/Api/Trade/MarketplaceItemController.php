<?php

namespace App\Http\Controllers\Api\Trade;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trade\StoreMarketplaceItemRequest;
use App\Http\Resources\MarketplaceItemResource;
use App\Models\MarketplaceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MarketplaceItemController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $items = MarketplaceItem::with(['seller.verification', 'images'])
            ->active()
            ->when($request->query('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->query('max_price'), function ($query, $maxPrice) {
                $query->where('price', '<=', $maxPrice);
            })
            ->when($request->query('condition'), function ($query, $condition) {
                $query->where('condition', $condition);
            })
            ->latest()
            ->paginate(20);

        return MarketplaceItemResource::collection($items);
    }

    public function store(StoreMarketplaceItemRequest $request): JsonResponse
    {
        $item = MarketplaceItem::create([
            'seller_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'price' => $request->validated('price'),
            'category' => $request->validated('category'),
            'condition' => $request->validated('condition'),
            'status' => 'active',
        ]);

        $item->load(['seller.verification', 'images']);

        return response()->json([
            'message' => 'Marketplace item listed successfully',
            'data' => new MarketplaceItemResource($item),
        ], 201);
    }

    public function show(MarketplaceItem $item): MarketplaceItemResource
    {
        $item->load(['seller.verification', 'images']);

        return new MarketplaceItemResource($item);
    }

    public function update(Request $request, MarketplaceItem $item): JsonResponse
    {
        if ($item->seller_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'integer', 'min:100'],
            'condition' => ['sometimes', 'in:new,like_new,good,fair'],
            'status' => ['sometimes', 'in:active,pending,sold,archived'],
        ]);

        $item->update($validated);
        $item->load(['seller.verification', 'images']);

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
}
