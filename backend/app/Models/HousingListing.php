<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HousingListing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'landlord_id',
        'title',
        'description',
        'monthly_rent',
        'deposit',
        'rooms',
        'latitude',
        'longitude',
        'address',
        'location',
        'property_type',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'monthly_rent' => 'integer',
            'deposit' => 'integer',
            'rooms' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function amenities(): HasOne
    {
        return $this->hasOne(HousingAmenity::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(ItemImage::class, 'imageable')
            ->orderBy('sort_order');
    }

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
