<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\AI\AIService;
use App\Services\AI\AIServiceInterface;
use App\Services\Auth\AuthService;
use App\Services\Auth\AuthServiceInterface;
use App\Services\ColdStorage\ColdStorageService;
use App\Services\ColdStorage\ColdStorageServiceInterface;
use App\Services\Common\ActivityLogService;
use App\Services\Common\ActivityLogServiceInterface;
use App\Services\Common\LookupService;
use App\Services\Common\LookupServiceInterface;
use App\Services\Common\SettingsService;
use App\Services\Common\SettingsServiceInterface;
use App\Services\Crop\CropService;
use App\Services\Crop\CropServiceInterface;
use App\Services\Dashboard\DashboardService;
use App\Services\Dashboard\DashboardServiceInterface;
use App\Services\Disease\DiseaseService;
use App\Services\Disease\DiseaseServiceInterface;
use App\Services\Equipment\EquipmentService;
use App\Services\Equipment\EquipmentServiceInterface;
use App\Services\Farmer\FarmerService;
use App\Services\Farmer\FarmerServiceInterface;
use App\Services\GovernmentScheme\GovernmentSchemeService;
use App\Services\GovernmentScheme\GovernmentSchemeServiceInterface;
use App\Services\Market\MarketService;
use App\Services\Market\MarketServiceInterface;
use App\Services\Notification\NotificationService;
use App\Services\Notification\NotificationServiceInterface;
use App\Services\Report\ReportService;
use App\Services\Report\ReportServiceInterface;
use App\Services\Soil\SoilService;
use App\Services\Soil\SoilServiceInterface;
use App\Services\Transport\TransportService;
use App\Services\Transport\TransportServiceInterface;
use App\Services\Weather\Providers\OpenMeteoProvider;
use App\Services\Weather\Providers\WeatherProviderInterface;
use App\Services\Weather\WeatherService;
use App\Services\Weather\WeatherServiceInterface;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    /**
     * Register every service contract with its implementation.
     */
    public function register(): void
    {
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(FarmerServiceInterface::class, FarmerService::class);
        $this->app->bind(CropServiceInterface::class, CropService::class);
        $this->app->bind(WeatherServiceInterface::class, WeatherService::class);
        $this->app->bind(WeatherProviderInterface::class, OpenMeteoProvider::class);
        $this->app->bind(SoilServiceInterface::class, SoilService::class);
        $this->app->bind(DiseaseServiceInterface::class, DiseaseService::class);
        $this->app->bind(MarketServiceInterface::class, MarketService::class);
        $this->app->bind(GovernmentSchemeServiceInterface::class, GovernmentSchemeService::class);
        $this->app->bind(EquipmentServiceInterface::class, EquipmentService::class);
        $this->app->bind(ColdStorageServiceInterface::class, ColdStorageService::class);
        $this->app->bind(TransportServiceInterface::class, TransportService::class);
        $this->app->bind(NotificationServiceInterface::class, NotificationService::class);
        $this->app->bind(ReportServiceInterface::class, ReportService::class);
        $this->app->bind(DashboardServiceInterface::class, DashboardService::class);
        $this->app->bind(AIServiceInterface::class, AIService::class);
        $this->app->bind(LookupServiceInterface::class, LookupService::class);
        $this->app->bind(ActivityLogServiceInterface::class, ActivityLogService::class);
        $this->app->bind(SettingsServiceInterface::class, SettingsService::class);
    }
}
