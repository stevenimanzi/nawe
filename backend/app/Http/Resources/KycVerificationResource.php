<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KycVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'document_type' => $this->document_type,
            'id_number' => $this->id_number,
            'full_name' => $this->full_name,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'id_front_image_url' => $this->id_front_image_path ? asset('storage/'.$this->id_front_image_path) : null,
            'id_back_image_url' => $this->id_back_image_path ? asset('storage/'.$this->id_back_image_path) : null,
            'selfie_with_id_url' => $this->selfie_with_id_path ? asset('storage/'.$this->selfie_with_id_path) : null,
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'reviewed_by' => $this->reviewed_by,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
