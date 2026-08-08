<?php

namespace App\Providers;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use App\Models\DiseaseDetection;
use App\Models\Equipment;
use App\Models\EquipmentBooking;
use App\Models\FarmerCrop;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\Harvest;
use App\Models\Notification;
use App\Models\SchemeApplication;
use App\Models\SoilHistory;
use App\Models\SoilTest;
use App\Models\TransportBooking;
use App\Models\Vehicle;
use App\Observers\UnifiedDashboardCacheObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            $key = $request->input('identifier')
                ?? $request->input('phone')
                ?? $request->ip();

            return Limit::perMinute(5)->by('auth:' . $key);
        });

        foreach ([
            FarmerProfile::class,
            FarmerField::class,
            FarmerCrop::class,
            Harvest::class,
            SoilTest::class,
            SoilHistory::class,
            DiseaseDetection::class,
            SchemeApplication::class,
            Equipment::class,
            EquipmentBooking::class,
            ColdStorage::class,
            ColdStorageBooking::class,
            Vehicle::class,
            TransportBooking::class,
            Notification::class,
        ] as $model) {
            $model::observe(UnifiedDashboardCacheObserver::class);
        }
    }
}
