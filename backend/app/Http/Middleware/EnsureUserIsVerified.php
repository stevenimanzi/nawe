<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isVerified()) {
            return response()->json([
                'message' => 'Identity verification required. Please submit your RP Musanze student or landlord ID for approval.',
                'code' => 'UNVERIFIED_IDENTITY',
            ], 403);
        }

        return $next($request);
    }
}
