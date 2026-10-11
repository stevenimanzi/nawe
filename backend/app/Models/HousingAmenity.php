<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousingAmenity extends Model
{
    protected $fillable = [
        'housing_listing_id',
        'has_water',
        'has_wifi',
        'has_electricity',
        'has_parking',
        'is_furnished',
        'distance_to_campus_meters',
    ];

    protected function casts(): array
    {
        return [
            'has_water' => 'boolean',
            'has_wifi' => 'boolean',
            'has_electricity' => 'boolean',
            'has_parking' => 'boolean',
            'is_furnished' => 'boolean',
            'distance_to_campus_meters' => 'integer',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(HousingListing::class, 'housing_listing_id');
    }
}
