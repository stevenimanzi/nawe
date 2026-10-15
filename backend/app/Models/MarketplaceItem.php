<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MarketplaceItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'title',
        'description',
        'price',
        'category',
        'condition',
        'listing_type',
        'rent_period',
        'location',
        'latitude',
        'longitude',
        'is_urgent',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'is_urgent' => 'boolean',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
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

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
