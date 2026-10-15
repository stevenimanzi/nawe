<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\HousingListingResource;
use App\Http\Resources\MarketplaceItemResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($user->id)],
            // Admins keep their role; everyone else can switch between member and landlord.
            'role' => ['sometimes', 'in:member,landlord'],
        ]);

        if ($user->isAdmin()) {
            unset($data['role']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated',
            'data' => new UserResource($user->load(['verification', 'kycVerification'])),
        ]);
    }

    public function password(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'Password updated']);
    }

    /** Everything the signed-in user has posted, in any status. */
    public function listings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json(['data' => [
            'items' => MarketplaceItemResource::collection(
                $user->marketplaceItems()->with(['seller.kycVerification', 'images'])->latest('id')->get()
            ),
            'listings' => HousingListingResource::collection(
                $user->housingListings()->with(['landlord.kycVerification', 'amenities', 'images'])->latest('id')->get()
            ),
        ]]);
    }
}
