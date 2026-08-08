<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\ImportController;
use App\Http\Controllers\Api\AIAdvisoryController;
use App\Http\Controllers\Api\AIHistoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ColdStorageBookingController;
use App\Http\Controllers\Api\ColdStorageController;
use App\Http\Controllers\Api\CropController;
use App\Http\Controllers\Api\DiseaseController;
use App\Http\Controllers\Api\EquipmentBookingController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\GovernmentSchemeController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SoilController;
use App\Http\Controllers\Api\TransportBookingController;
use App\Http\Controllers\Api\TransportController;
use App\Http\Controllers\Api\UnifiedDashboardController;
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

Route::prefix('soil')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('tests', [SoilController::class, 'index']);
    Route::post('tests', [SoilController::class, 'store']);
    Route::get('tests/{testId}/recommendations', [SoilController::class, 'recommendations']);
    Route::get('tests/{testId}', [SoilController::class, 'show']);
    Route::put('tests/{testId}', [SoilController::class, 'update']);
    Route::patch('tests/{testId}', [SoilController::class, 'update']);
    Route::delete('tests/{testId}', [SoilController::class, 'destroy']);
    Route::get('history', [SoilController::class, 'history']);
    Route::get('health/{fieldId}', [SoilController::class, 'health']);
    Route::get('dashboard', [SoilController::class, 'dashboard']);
});

Route::prefix('disease')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('detections', [DiseaseController::class, 'index']);
    Route::post('detections', [DiseaseController::class, 'store']);
    Route::post('detections/{detectionId}/images', [DiseaseController::class, 'attachImages']);
    Route::get('detections/{detectionId}/treatment', [DiseaseController::class, 'treatment']);
    Route::get('detections/{detectionId}', [DiseaseController::class, 'show']);
    Route::put('detections/{detectionId}', [DiseaseController::class, 'update']);
    Route::patch('detections/{detectionId}', [DiseaseController::class, 'update']);
    Route::delete('detections/{detectionId}', [DiseaseController::class, 'destroy']);
    Route::get('history', [DiseaseController::class, 'history']);
    Route::get('dashboard', [DiseaseController::class, 'dashboard']);
    Route::post('images', [DiseaseController::class, 'uploadImages']);
});

Route::prefix('market')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('prices', [MarketController::class, 'index']);
    Route::post('prices', [MarketController::class, 'store']);
    Route::get('prices/today', [MarketController::class, 'today']);
    Route::get('prices/history', [MarketController::class, 'history']);
    Route::get('prices/{priceId}', [MarketController::class, 'show']);
    Route::get('mandis', [MarketController::class, 'mandis']);
    Route::get('mandis/nearby', [MarketController::class, 'nearby']);
    Route::get('mandis/{mandiId}', [MarketController::class, 'showMandi']);
    Route::get('predictions', [MarketController::class, 'predict']);
    Route::get('best-selling', [MarketController::class, 'bestSelling']);
    Route::get('dashboard', [MarketController::class, 'dashboard']);
    Route::post('sync', [MarketController::class, 'sync']);
});

Route::prefix('schemes')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/', [GovernmentSchemeController::class, 'index']);
    Route::post('documents', [GovernmentSchemeController::class, 'uploadDocuments']);
    Route::get('applications', [GovernmentSchemeController::class, 'history']);
    Route::get('applications/{applicationId}', [GovernmentSchemeController::class, 'showApplication']);
    Route::post('applications/{applicationId}/submit', [GovernmentSchemeController::class, 'submitApplication']);
    Route::get('dashboard', [GovernmentSchemeController::class, 'dashboard']);
    Route::post('sync', [GovernmentSchemeController::class, 'sync']);
    Route::get('{schemeId}/eligibility', [GovernmentSchemeController::class, 'eligibility']);
    Route::post('{schemeId}/applications', [GovernmentSchemeController::class, 'startApplication']);
    Route::get('{schemeId}', [GovernmentSchemeController::class, 'show']);
});

Route::prefix('equipment')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/', [EquipmentController::class, 'index']);
    Route::post('/', [EquipmentController::class, 'store']);
    Route::get('mine', [EquipmentController::class, 'mine']);
    Route::get('dashboard', [EquipmentController::class, 'dashboard']);

    Route::prefix('bookings')->group(function () {
        Route::get('/', [EquipmentBookingController::class, 'index']);
        Route::get('owner', [EquipmentBookingController::class, 'owner']);
        Route::get('{bookingId}', [EquipmentBookingController::class, 'show']);
        Route::post('{bookingId}/accept', [EquipmentBookingController::class, 'accept']);
        Route::post('{bookingId}/reject', [EquipmentBookingController::class, 'reject']);
        Route::post('{bookingId}/cancel', [EquipmentBookingController::class, 'cancel']);
        Route::post('{bookingId}/complete', [EquipmentBookingController::class, 'complete']);
    });

    Route::post('{equipmentId}/bookings', [EquipmentBookingController::class, 'store']);
    Route::get('{equipmentId}', [EquipmentController::class, 'show']);
    Route::put('{equipmentId}', [EquipmentController::class, 'update']);
    Route::patch('{equipmentId}', [EquipmentController::class, 'update']);
    Route::delete('{equipmentId}', [EquipmentController::class, 'destroy']);
});

Route::prefix('cold-storage')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/', [ColdStorageController::class, 'index']);
    Route::post('/', [ColdStorageController::class, 'store']);
    Route::get('mine', [ColdStorageController::class, 'mine']);
    Route::get('dashboard', [ColdStorageController::class, 'dashboard']);

    Route::prefix('bookings')->group(function () {
        Route::get('/', [ColdStorageBookingController::class, 'index']);
        Route::get('owner', [ColdStorageBookingController::class, 'owner']);
        Route::get('{bookingId}', [ColdStorageBookingController::class, 'show']);
        Route::post('{bookingId}/approve', [ColdStorageBookingController::class, 'approve']);
        Route::post('{bookingId}/reject', [ColdStorageBookingController::class, 'reject']);
        Route::post('{bookingId}/cancel', [ColdStorageBookingController::class, 'cancel']);
        Route::post('{bookingId}/complete', [ColdStorageBookingController::class, 'complete']);
    });

    Route::get('{storageId}/monitoring', [ColdStorageController::class, 'monitoring']);
    Route::post('{storageId}/bookings', [ColdStorageBookingController::class, 'store']);
    Route::get('{storageId}', [ColdStorageController::class, 'show']);
    Route::put('{storageId}', [ColdStorageController::class, 'update']);
    Route::patch('{storageId}', [ColdStorageController::class, 'update']);
    Route::delete('{storageId}', [ColdStorageController::class, 'destroy']);
});

Route::prefix('transport')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/', [TransportController::class, 'index']);
    Route::post('/', [TransportController::class, 'store']);
    Route::get('mine', [TransportController::class, 'mine']);
    Route::get('dashboard', [TransportController::class, 'dashboard']);
    Route::post('cost-estimate', [TransportController::class, 'costEstimate']);
    Route::get('route-estimate', [TransportController::class, 'routeEstimate']);

    Route::prefix('bookings')->group(function () {
        Route::get('/', [TransportBookingController::class, 'index']);
        Route::get('owner', [TransportBookingController::class, 'owner']);
        Route::get('{bookingId}', [TransportBookingController::class, 'show']);
        Route::post('{bookingId}/approve', [TransportBookingController::class, 'approve']);
        Route::post('{bookingId}/reject', [TransportBookingController::class, 'reject']);
        Route::post('{bookingId}/cancel', [TransportBookingController::class, 'cancel']);
        Route::post('{bookingId}/complete', [TransportBookingController::class, 'complete']);
    });

    Route::post('{vehicleId}/bookings', [TransportBookingController::class, 'store']);
    Route::get('{vehicleId}', [TransportController::class, 'show']);
    Route::put('{vehicleId}', [TransportController::class, 'update']);
    Route::patch('{vehicleId}', [TransportController::class, 'update']);
    Route::delete('{vehicleId}', [TransportController::class, 'destroy']);
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

Route::prefix('dashboard')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('unified', [UnifiedDashboardController::class, 'show']);
});

Route::prefix('reports')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/', [ReportController::class, 'store']);
    Route::get('/', [ReportController::class, 'index']);
    Route::get('recent', [ReportController::class, 'recent']);
    Route::get('favorites', [ReportController::class, 'favorites']);
    Route::get('{reportId}', [ReportController::class, 'show']);
    Route::get('{reportId}/download', [ReportController::class, 'download']);
    Route::patch('{reportId}/favorite', [ReportController::class, 'favorite']);
    Route::delete('{reportId}', [ReportController::class, 'destroy']);
});

Route::prefix('ai')->middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('advisory', [AIAdvisoryController::class, 'store']);
    Route::get('providers', [AIAdvisoryController::class, 'providers']);

    Route::get('history', [AIHistoryController::class, 'index']);
    Route::get('history/{id}', [AIHistoryController::class, 'show']);
    Route::delete('history/{id}', [AIHistoryController::class, 'destroy']);
    Route::post('history/{id}/favorite', [AIHistoryController::class, 'favorite']);
    Route::delete('history/{id}/favorite', [AIHistoryController::class, 'unfavorite']);
    Route::post('history/{id}/feedback', [AIHistoryController::class, 'feedback']);
    Route::get('favorites', [AIHistoryController::class, 'favorites']);
});

Route::prefix('admin/imports')->middleware(['auth:sanctum', 'active', 'role:admin'])->group(function () {
    Route::post('validate', [ImportController::class, 'validateCsv']);
    Route::post('preview', [ImportController::class, 'preview']);
    Route::post('dry-run', [ImportController::class, 'dryRun']);
    Route::post('/', [ImportController::class, 'store']);
    Route::post('{importId}/rollback', [ImportController::class, 'rollback']);
    Route::get('/', [ImportController::class, 'index']);
    Route::get('{importId}', [ImportController::class, 'show']);
    Route::get('{importId}/logs', [ImportController::class, 'logs']);
});

