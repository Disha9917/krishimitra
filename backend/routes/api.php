<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CropController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\WeatherController;
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

Route::prefix('farmer')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('me', [FarmerController::class, 'profile']);
    Route::put('me', [FarmerController::class, 'updateProfile']);
    Route::patch('me', [FarmerController::class, 'updateProfile']);
    Route::get('dashboard', [FarmerController::class, 'dashboard']);

    Route::get('fields', [FarmerController::class, 'indexFields']);
    Route::post('fields', [FarmerController::class, 'storeField']);
    Route::get('fields/{fieldId}', [FarmerController::class, 'showField']);
    Route::put('fields/{fieldId}', [FarmerController::class, 'updateField']);
    Route::patch('fields/{fieldId}', [FarmerController::class, 'updateField']);
    Route::delete('fields/{fieldId}', [FarmerController::class, 'deleteField']);

    Route::prefix('crops')->group(function () {
        Route::get('/', [CropController::class, 'index']);
        Route::post('/', [CropController::class, 'store']);
        Route::get('calendar', [CropController::class, 'calendar']);
        Route::get('harvest-summary', [CropController::class, 'harvestSummary']);
        Route::get('history', [CropController::class, 'history']);
        Route::get('active', [CropController::class, 'active']);
        Route::get('seasonal', [CropController::class, 'seasonal']);
        Route::get('summary', [CropController::class, 'summary']);
        Route::get('{cropId}/timeline', [CropController::class, 'timeline']);
        Route::get('{cropId}/growth', [CropController::class, 'growth']);
        Route::get('{cropId}/status', [CropController::class, 'status']);
        Route::get('{cropId}', [CropController::class, 'show']);
        Route::put('{cropId}', [CropController::class, 'update']);
        Route::patch('{cropId}', [CropController::class, 'update']);
        Route::delete('{cropId}', [CropController::class, 'destroy']);
    });
});

Route::prefix('weather')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('current', [WeatherController::class, 'current']);
    Route::get('forecast', [WeatherController::class, 'forecast']);
    Route::get('hourly', [WeatherController::class, 'hourly']);
    Route::get('history', [WeatherController::class, 'history']);
    Route::get('cache', [WeatherController::class, 'cache']);
    Route::post('cache/refresh', [WeatherController::class, 'refresh']);
    Route::get('alerts', [WeatherController::class, 'alerts']);
    Route::post('alerts/generate', [WeatherController::class, 'generateAlerts']);
    Route::get('dashboard', [WeatherController::class, 'dashboard']);
    Route::get('rain-prediction', [WeatherController::class, 'rainPrediction']);
    Route::get('temperature-trend', [WeatherController::class, 'temperatureTrend']);
    Route::get('humidity-trend', [WeatherController::class, 'humidityTrend']);
    Route::get('wind', [WeatherController::class, 'wind']);
    Route::get('uv-index', [WeatherController::class, 'uvIndex']);
    Route::get('sun', [WeatherController::class, 'sunTimes']);
    Route::get('summary', [WeatherController::class, 'summary']);
    Route::get('notifications', [WeatherController::class, 'notifications']);
    Route::post('notifications/generate', [WeatherController::class, 'generateNotifications']);
});
