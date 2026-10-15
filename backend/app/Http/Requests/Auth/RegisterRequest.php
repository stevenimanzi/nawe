<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone'],
            // 'student' is kept for older accounts; new sign-ups pick member or landlord.
            'role' => ['required', 'in:member,student,landlord'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
