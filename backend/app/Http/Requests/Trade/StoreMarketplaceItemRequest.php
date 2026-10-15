<?php

namespace App\Http\Requests\Trade;

use App\Support\Catalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketplaceItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'price' => ['required', 'integer', 'min:100', 'max:1000000000'],
            'category' => ['required', Rule::in(Catalog::ITEM_CATEGORIES)],
            'condition' => ['required', Rule::in(Catalog::CONDITIONS)],
            'listing_type' => ['sometimes', Rule::in(Catalog::LISTING_TYPES)],
            'rent_period' => [
                'nullable',
                'required_if:listing_type,rent',
                Rule::in(Catalog::RENT_PERIODS),
            ],
            'location' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_urgent' => ['sometimes', 'boolean'],
        ];
    }
}
