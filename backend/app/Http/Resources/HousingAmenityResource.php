<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HousingAmenityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'has_water' => (bool) $this->has_water,
            'has_wifi' => (bool) $this->has_wifi,
            'has_electricity' => (bool) $this->has_electricity,
            'has_parking' => (bool) $this->has_parking,
            'is_furnished' => (bool) $this->is_furnished,
            'distance_to_campus_meters' => $this->distance_to_campus_meters,
        ];
    }
}
