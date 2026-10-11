<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kyc\ReviewKycRequest;
use App\Http\Requests\Kyc\SubmitKycRequest;
use App\Http\Resources\KycVerificationResource;
use App\Models\KycAuditLog;
use App\Models\KycVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KycController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $kyc = $request->user()->kycVerification;

        if (! $kyc) {
            return response()->json([
                'message' => 'No KYC submitted yet.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'data' => new KycVerificationResource($kyc),
        ]);
    }

    public function store(SubmitKycRequest $request): JsonResponse
    {
        $user = $request->user();

        $frontPath = $request->file('id_front_image')->store('kyc/ids', 'public');
        $backPath = $request->hasFile('id_back_image')
            ? $request->file('id_back_image')->store('kyc/ids', 'public')
            : null;
        $selfiePath = $request->hasFile('selfie_with_id')
            ? $request->file('selfie_with_id')->store('kyc/selfies', 'public')
            : null;

        $kyc = DB::transaction(function () use ($user, $request, $frontPath, $backPath, $selfiePath) {
            $existing = $user->kycVerification;
            $previousStatus = $existing?->status;

            $record = KycVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'document_type' => $request->validated('document_type'),
                    'id_number' => $request->validated('id_number'),
                    'full_name' => $request->validated('full_name'),
                    'date_of_birth' => $request->validated('date_of_birth'),
                    'id_front_image_path' => $frontPath,
                    'id_back_image_path' => $backPath,
                    'selfie_with_id_path' => $selfiePath,
                    'status' => 'pending',
                    'rejection_reason' => null,
                    'submitted_at' => now(),
                ]
            );

            KycAuditLog::create([
                'kyc_verification_id' => $record->id,
                'actor_id' => $user->id,
                'action' => 'submitted',
                'previous_status' => $previousStatus,
                'new_status' => 'pending',
                'notes' => 'User submitted KYC ID Card verification documents.',
                'ip_address' => $request->ip(),
            ]);

            return $record;
        });

        return response()->json([
            'message' => 'KYC documents submitted successfully. Verification is pending review.',
            'data' => new KycVerificationResource($kyc),
        ], 201);
    }

    public function review(ReviewKycRequest $request, KycVerification $kyc): JsonResponse
    {
        $admin = $request->user();
        $previousStatus = $kyc->status;
        $newStatus = $request->validated('status');

        DB::transaction(function () use ($kyc, $admin, $previousStatus, $newStatus, $request) {
            $kyc->update([
                'status' => $newStatus,
                'rejection_reason' => $newStatus === 'rejected' ? $request->validated('rejection_reason') : null,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            KycAuditLog::create([
                'kyc_verification_id' => $kyc->id,
                'actor_id' => $admin->id,
                'action' => 'reviewed',
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
                'notes' => $request->validated('notes'),
                'ip_address' => $request->ip(),
            ]);
        });

        return response()->json([
            'message' => "KYC status updated to {$newStatus}",
            'data' => new KycVerificationResource($kyc->fresh()),
        ]);
    }
}
