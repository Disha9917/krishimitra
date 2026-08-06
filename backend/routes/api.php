<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('request-otp', [AuthController::class, 'requestOtp'])->middleware('throttle:auth');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:auth');
    Route::post('verify-otp', [AuthController::class, 'verifyOtp'])->middleware('throttle:auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('throttle:auth');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:auth');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:auth');

    Route::middleware(['auth:sanctum', 'active'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});
