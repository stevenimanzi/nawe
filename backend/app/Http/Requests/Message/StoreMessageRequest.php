<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'exists:users,id'],
            'messageable_type' => ['required', 'string', 'in:housing_listing,marketplace_item'],
            'messageable_id' => ['required', 'integer'],
            'content' => ['required', 'string', 'max:2000'],
        ];
    }
}
