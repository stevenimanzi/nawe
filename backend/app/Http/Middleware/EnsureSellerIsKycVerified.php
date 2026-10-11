<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSellerIsKycVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        $kyc = $user->kycVerification;

        if (! $kyc || ! $kyc->isApproved()) {
            $status = $kyc?->status ?? 'unsubmitted';

            return response()->json([
                'message' => 'Seller KYC verification required. Every seller must upload a valid National ID or passport to list products or interact in the marketplace.',
                'code' => 'KYC_VERIFICATION_REQUIRED',
                'kyc_status' => $status,
            ], 403);
        }

        return $next($request);
    }
}
