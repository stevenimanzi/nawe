<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'min:10', 'max:4000'],
        ]);

        $contact = ContactMessage::create([
            ...$data,
            'user_id' => $request->user('sanctum')?->id,
            'ip_address' => $request->ip(),
        ]);

        Log::info('New contact message', ['id' => $contact->id, 'subject' => $contact->subject]);

        return response()->json([
            'message' => 'Thanks for getting in touch. We will reply by email.',
        ], 201);
    }
}
