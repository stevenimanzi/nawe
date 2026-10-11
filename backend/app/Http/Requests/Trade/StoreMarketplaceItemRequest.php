<?php

namespace App\Http\Requests\Trade;

use Illuminate\Foundation\Http\FormRequest;

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
            'description' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:100'],
            'category' => [
                'required',
                'in:essentials,electronics,tvet_tools,books,clothing,other',
            ],
            'condition' => ['required', 'in:new,like_new,good,fair'],
        ];
    }
}
