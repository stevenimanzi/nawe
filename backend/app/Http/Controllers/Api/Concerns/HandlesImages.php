<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Http\Resources\ItemImageResource;
use App\Models\ItemImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HandlesImages
{
    private const MAX_IMAGES = 8;

    /** Adds uploaded photos to a listing the user owns. */
    protected function addImages(Request $request, Model $owner, int $ownerId): JsonResponse
    {
        if ($ownerId !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:'.self::MAX_IMAGES],
            'images.*' => ['file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:6144'],
        ]);

        $existing = $owner->images()->count();
        $files = $request->file('images');

        if ($existing + count($files) > self::MAX_IMAGES) {
            return response()->json([
                'message' => 'A listing can have at most '.self::MAX_IMAGES.' photos.',
                'errors' => ['images' => ['A listing can have at most '.self::MAX_IMAGES.' photos.']],
            ], 422);
        }

        $order = (int) $owner->images()->max('sort_order') + ($existing ? 1 : 0);

        foreach ($files as $file) {
            $owner->images()->create([
                'path' => $file->store('listings', 'public'),
                'disk' => 'public',
                'sort_order' => $order++,
            ]);
        }

        return response()->json([
            'message' => 'Photos uploaded',
            'data' => ItemImageResource::collection($owner->images()->get()),
        ], 201);
    }

    /** Removes one photo (and its file) from a listing the user owns. */
    protected function removeImage(Request $request, Model $owner, int $ownerId, ItemImage $image): JsonResponse
    {
        if ($ownerId !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($image->imageable_id !== $owner->getKey() || $image->imageable_type !== $owner::class) {
            return response()->json(['message' => 'Photo not found'], 404);
        }

        if ($image->disk !== 'url') {
            Storage::disk($image->disk)->delete($image->path);
        }

        $image->delete();

        return response()->json(['message' => 'Photo removed']);
    }
}
