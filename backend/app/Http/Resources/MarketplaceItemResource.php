<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketplaceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'category' => $this->category,
            'condition' => $this->condition,
            'listing_type' => $this->listing_type,
            'rent_period' => $this->rent_period,
            'location' => $this->location,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_urgent' => (bool) $this->is_urgent,
            'status' => $this->status,
            'distance_km' => isset($this->distance_km) ? round($this->distance_km, 1) : null,
            'seller' => new PublicUserResource($this->whenLoaded('seller')),
            'images' => ItemImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
