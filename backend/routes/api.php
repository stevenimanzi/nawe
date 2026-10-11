<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\UserController;
use App\Http\Controllers\Api\Dwell\HousingListingController;
use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\Trade\MarketplaceItemController;
use App\Http\Controllers\Api\VerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', RegisterController::class);
        Route::post('login', LoginController::class);
    });

    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->group(function () {
            Route::get('me', UserController::class);
            Route::post('logout', LogoutController::class);
        });

        Route::prefix('verification')->group(function () {
            Route::get('/', [VerificationController::class, 'show']);
            Route::post('/', [VerificationController::class, 'store']);
        });

        Route::prefix('kyc')->group(function () {
            Route::get('/', [KycController::class, 'show']);
            Route::post('/', [KycController::class, 'store']);
            Route::post('{kyc}/review', [KycController::class, 'review']);
        });

        Route::prefix('dwell')->group(function () {
            Route::apiResource('listings', HousingListingController::class);
        });

        Route::prefix('trade')->group(function () {
            Route::apiResource('items', MarketplaceItemController::class)
                ->except(['store']);
            Route::post('items', [MarketplaceItemController::class, 'store'])
                ->middleware('verified.seller');
        });

        Route::apiResource('messages', MessageController::class)
            ->only(['index', 'store']);
    });
});
