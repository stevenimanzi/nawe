<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\HousingListing;
use App\Models\MarketplaceItem;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $messages = Message::with(['sender.verification', 'receiver.verification'])
            ->where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId);
            })
            ->when($request->query('entity_type') && $request->query('entity_id'), function ($query) use ($request) {
                $type = $request->query('entity_type') === 'housing_listing'
                    ? HousingListing::class
                    : MarketplaceItem::class;
                $query->where('messageable_type', $type)
                    ->where('messageable_id', $request->query('entity_id'));
            })
            ->latest()
            ->paginate(30);

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $targetClass = $request->validated('messageable_type') === 'housing_listing'
            ? HousingListing::class
            : MarketplaceItem::class;

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->validated('receiver_id'),
            'messageable_type' => $targetClass,
            'messageable_id' => $request->validated('messageable_id'),
            'content' => $request->validated('content'),
        ]);

        $message->load(['sender.verification', 'receiver.verification']);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => new MessageResource($message),
        ], 201);
    }
}
