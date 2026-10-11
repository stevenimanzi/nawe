<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Verification\StoreVerificationRequest;
use App\Http\Resources\VerificationResource;
use App\Models\Verification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $verification = $request->user()->verification;

        if (! $verification) {
            return response()->json([
                'message' => 'No verification record submitted yet.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'data' => new VerificationResource($verification),
        ]);
    }

    public function store(StoreVerificationRequest $request): JsonResponse
    {
        $user = $request->user();

        $path = null;
        if ($request->hasFile('id_document')) {
            $path = $request->file('id_document')->store('verifications', 'public');
        }

        $verification = Verification::updateOrCreate(
            ['user_id' => $user->id],
            [
                'registration_number' => $request->validated('registration_number'),
                'id_document_path' => $path,
                'status' => 'pending',
                'rejection_reason' => null,
            ]
        );

        return response()->json([
            'message' => 'Verification details submitted for review.',
            'data' => new VerificationResource($verification),
        ], 201);
    }
}
