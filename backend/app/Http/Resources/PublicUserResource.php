<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * What other people may see about a user on public listings.
 * Email is never exposed here; the phone number is shown to signed-in members only.
 */
class PublicUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'is_kyc_verified' => $this->isKycVerified(),
            // Phone numbers are only shown to signed-in members, to keep scrapers out.
            'phone' => $request->user('sanctum') ? $this->phone : null,
            'member_since' => $this->created_at?->toIso8601String(),
        ];
    }
}
