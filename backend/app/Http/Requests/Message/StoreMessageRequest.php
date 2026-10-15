<?php

namespace App\Http\Requests\Message;

use App\Models\HousingListing;
use App\Models\MarketplaceItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $senderId = $this->user()->id;
            $receiverId = (int) $this->input('receiver_id');

            if ($receiverId === $senderId) {
                $validator->errors()->add('receiver_id', 'You cannot send a message to yourself.');

                return;
            }

            $entity = $this->input('messageable_type') === 'housing_listing'
                ? HousingListing::find($this->input('messageable_id'))
                : MarketplaceItem::find($this->input('messageable_id'));

            if (! $entity) {
                $validator->errors()->add('messageable_id', 'This listing no longer exists.');

                return;
            }

            $ownerId = $entity instanceof HousingListing ? $entity->landlord_id : $entity->seller_id;

            // A conversation is always between the listing owner and one other person.
            if ($ownerId !== $receiverId && $ownerId !== $senderId) {
                $validator->errors()->add('receiver_id', 'Messages about a listing must involve its owner.');
            }
        }];
    }
}
