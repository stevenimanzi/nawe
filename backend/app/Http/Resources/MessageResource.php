<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'sender' => new UserResource($this->whenLoaded('sender')),
            'receiver' => new UserResource($this->whenLoaded('receiver')),
            'messageable_type' => $this->messageable_type,
            'messageable_id' => $this->messageable_id,
            'content' => $this->content,
            'read_at' => $this->read_at?->toIso8601String(),
            'is_read' => $this->isRead(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
