<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class ItemImage extends Model
{
    protected $fillable = [
        'path',
        'disk',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /** Public URL. Seeded demo photos use disk 'url', where the path is already a full URL. */
    public function getUrlAttribute(): string
    {
        if ($this->disk === 'url') {
            return $this->path;
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
