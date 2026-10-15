<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Http\Resources\PublicUserResource;
use App\Models\HousingListing;
use App\Models\MarketplaceItem;
use App\Models\Message;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $messages = Message::with(['sender.kycVerification', 'receiver.kycVerification'])
            ->where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId);
            })
            ->when($request->query('entity_type') && $request->query('entity_id'), function ($query) use ($request) {
                $query->where('messageable_type', $this->classFor($request->query('entity_type')))
                    ->where('messageable_id', $request->query('entity_id'));
            })
            ->latest()
            ->paginate(30);

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->validated('receiver_id'),
            'messageable_type' => $this->classFor($request->validated('messageable_type')),
            'messageable_id' => $request->validated('messageable_id'),
            'content' => $request->validated('content'),
        ]);

        $message->load(['sender.kycVerification', 'receiver.kycVerification']);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => new MessageResource($message),
        ], 201);
    }

    /** One row per (other person, listing), newest first, with unread counts. */
    public function conversations(Request $request): JsonResponse
    {
        $me = $request->user()->id;

        $messages = Message::with([
            'sender.kycVerification',
            'receiver.kycVerification',
            'messageable' => fn (MorphTo $morph) => $morph->morphWith([
                HousingListing::class => ['images'],
                MarketplaceItem::class => ['images'],
            ]),
        ])
            ->where(fn ($q) => $q->where('sender_id', $me)->orWhere('receiver_id', $me))
            ->latest('id')
            ->limit(1000)
            ->get();

        $rows = $messages
            ->groupBy(fn (Message $m) => min($m->sender_id, $m->receiver_id).'-'.max($m->sender_id, $m->receiver_id)
                .'|'.$m->messageable_type.'|'.$m->messageable_id)
            ->map(function ($group) use ($me, $request) {
                /** @var Message $last */
                $last = $group->first();
                $other = $last->sender_id === $me ? $last->receiver : $last->sender;
                $entity = $last->messageable;

                return [
                    'other_user' => (new PublicUserResource($other))->toArray($request),
                    'entity_type' => $last->messageable_type === HousingListing::class ? 'housing_listing' : 'marketplace_item',
                    'entity_id' => $last->messageable_id,
                    'entity_title' => $entity?->title ?? 'Listing no longer available',
                    'entity_image' => $entity?->images->first()?->url,
                    'last_message' => $last->content,
                    'last_message_at' => $last->created_at?->toIso8601String(),
                    'last_from_me' => $last->sender_id === $me,
                    'unread_count' => $group->where('receiver_id', $me)->whereNull('read_at')->count(),
                ];
            })
            ->values();

        return response()->json(['data' => $rows]);
    }

    /** Full back-and-forth about one listing, oldest first. Opening it marks the other person's messages as read. */
    public function thread(Request $request): JsonResponse
    {
        $data = $request->validate([
            'with' => ['required', 'integer', 'exists:users,id'],
            'entity_type' => ['required', 'in:housing_listing,marketplace_item'],
            'entity_id' => ['required', 'integer'],
        ]);

        $me = $request->user()->id;
        $other = (int) $data['with'];

        $query = Message::where('messageable_type', $this->classFor($data['entity_type']))
            ->where('messageable_id', $data['entity_id'])
            ->where(function ($q) use ($me, $other) {
                $q->where(fn ($inner) => $inner->where('sender_id', $me)->where('receiver_id', $other))
                    ->orWhere(fn ($inner) => $inner->where('sender_id', $other)->where('receiver_id', $me));
            });

        (clone $query)->where('receiver_id', $me)->whereNull('read_at')->update(['read_at' => now()]);

        $messages = $query->with(['sender.kycVerification', 'receiver.kycVerification'])
            ->orderBy('id')
            ->limit(300)
            ->get();

        return response()->json(['data' => MessageResource::collection($messages)]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'data' => ['count' => Message::where('receiver_id', $request->user()->id)->unread()->count()],
        ]);
    }

    private function classFor(string $type): string
    {
        return $type === 'housing_listing' ? HousingListing::class : MarketplaceItem::class;
    }
}
