<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\UserController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Dwell\HousingListingController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\Trade\MarketplaceItemController;
use App\Http\Controllers\Api\VerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    /* ---------------- Public ---------------- */

    Route::prefix('auth')->middleware('throttle:30,1')->group(function () {
        Route::post('register', RegisterController::class);
        Route::post('login', LoginController::class);
    });

    // Anyone can browse listings. Contact details and messaging need an account.
    Route::get('trade/items', [MarketplaceItemController::class, 'index']);
    Route::get('trade/items/{item}', [MarketplaceItemController::class, 'show'])->whereNumber('item');
    Route::get('dwell/listings', [HousingListingController::class, 'index']);
    Route::get('dwell/listings/{listing}', [HousingListingController::class, 'show'])->whereNumber('listing');

    Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:10,1');

    /* ---------------- Signed in ---------------- */

    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->group(function () {
            Route::get('me', UserController::class);
            Route::post('logout', LogoutController::class);
            Route::patch('profile', [ProfileController::class, 'update']);
            Route::post('password', [ProfileController::class, 'password']);
        });

        Route::get('me/listings', [ProfileController::class, 'listings']);

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
            Route::post('listings', [HousingListingController::class, 'store'])
                ->middleware('verified.seller');
            Route::match(['put', 'patch'], 'listings/{listing}', [HousingListingController::class, 'update']);
            Route::delete('listings/{listing}', [HousingListingController::class, 'destroy']);
            Route::post('listings/{listing}/images', [HousingListingController::class, 'storeImages']);
            Route::delete('listings/{listing}/images/{image}', [HousingListingController::class, 'destroyImage']);
        });

        Route::prefix('trade')->group(function () {
            Route::post('items', [MarketplaceItemController::class, 'store'])
                ->middleware('verified.seller');
            Route::match(['put', 'patch'], 'items/{item}', [MarketplaceItemController::class, 'update']);
            Route::delete('items/{item}', [MarketplaceItemController::class, 'destroy']);
            Route::post('items/{item}/images', [MarketplaceItemController::class, 'storeImages']);
            Route::delete('items/{item}/images/{image}', [MarketplaceItemController::class, 'destroyImage']);
        });

        Route::get('messages/conversations', [MessageController::class, 'conversations']);
        Route::get('messages/thread', [MessageController::class, 'thread']);
        Route::get('messages/unread-count', [MessageController::class, 'unreadCount']);
        Route::apiResource('messages', MessageController::class)->only(['index', 'store']);

        Route::get('favorites', [FavoriteController::class, 'index']);
        Route::get('favorites/ids', [FavoriteController::class, 'ids']);
        Route::post('favorites', [FavoriteController::class, 'store']);
        Route::delete('favorites/{type}/{id}', [FavoriteController::class, 'destroy'])->whereNumber('id');

        Route::post('reports', [ReportController::class, 'store'])->middleware('throttle:20,1');

        Route::prefix('admin')->group(function () {
            Route::get('stats', [AdminController::class, 'stats']);
            Route::get('kyc', [AdminController::class, 'kyc']);
            Route::get('reports', [AdminController::class, 'reports']);
            Route::patch('reports/{report}', [AdminController::class, 'updateReport']);
        });
    });
});
