<?php

namespace App\Http\Requests\Dwell;

use App\Support\Catalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHousingListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canListHousing() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'monthly_rent' => ['required', 'integer', 'min:5000', 'max:100000000'],
            'deposit' => ['required', 'integer', 'min:0', 'max:100000000'],
            'rooms' => ['required', 'integer', 'min:1', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:100'],
            'property_type' => ['sometimes', Rule::in(Catalog::PROPERTY_TYPES)],
            'has_water' => ['boolean'],
            'has_wifi' => ['boolean'],
            'has_electricity' => ['boolean'],
            'has_parking' => ['boolean'],
            'is_furnished' => ['boolean'],
            'distance_to_campus_meters' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function failedAuthorization(): void
    {
        abort(response()->json([
            'message' => 'Only landlord accounts can list rooms and houses. Switch your account type in Account settings.',
            'code' => 'LANDLORD_ROLE_REQUIRED',
        ], 403));
    }
}
