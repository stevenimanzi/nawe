<?php

namespace App\Http\Requests\Dwell;

use Illuminate\Foundation\Http\FormRequest;

class StoreHousingListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isLandlord() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'monthly_rent' => ['required', 'integer', 'min:5000'],
            'deposit' => ['required', 'integer', 'min:0'],
            'rooms' => ['required', 'integer', 'min:1', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:255'],
            'has_water' => ['boolean'],
            'has_wifi' => ['boolean'],
            'has_electricity' => ['boolean'],
            'has_parking' => ['boolean'],
            'is_furnished' => ['boolean'],
            'distance_to_campus_meters' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
