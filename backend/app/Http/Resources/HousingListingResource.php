<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HousingListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'monthly_rent' => $this->monthly_rent,
            'deposit' => $this->deposit,
            'rooms' => $this->rooms,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'address' => $this->address,
            'location' => $this->location,
            'property_type' => $this->property_type,
            'status' => $this->status,
            'distance_km' => isset($this->distance_km) ? round($this->distance_km, 1) : null,
            'landlord' => new PublicUserResource($this->whenLoaded('landlord')),
            'amenities' => new HousingAmenityResource($this->whenLoaded('amenities')),
            'images' => ItemImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
