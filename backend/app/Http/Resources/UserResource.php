<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'is_verified' => $this->isVerified(),
            'is_kyc_verified' => $this->isKycVerified(),
            'verification' => new VerificationResource($this->whenLoaded('verification')),
            'kyc_verification' => new KycVerificationResource($this->whenLoaded('kycVerification')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
