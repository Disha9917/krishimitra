<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register every repository interface with its Eloquent implementation.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\ActivityLogRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentActivityLogRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\AiAdvisoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentAiAdvisoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\AuditLogRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentAuditLogRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ChatHistoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentChatHistoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ColdStorageRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentColdStorageRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ColdStorageBookingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentColdStorageBookingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ContactRequestRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentContactRequestRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\CropRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentCropRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\CropCalendarRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentCropCalendarRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\CropRecommendationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentCropRecommendationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\CropVarietyRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentCropVarietyRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DashboardAnalyticRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDashboardAnalyticRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DiseaseRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDiseaseRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DiseaseDetectionRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDiseaseDetectionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DiseaseHistoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDiseaseHistoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DiseaseImageRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDiseaseImageRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DistrictRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDistrictRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DistrictCropMapRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentDistrictCropMapRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\EquipmentRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentEquipmentRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\EquipmentBookingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentEquipmentBookingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ExportHistoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentExportHistoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FaqRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFaqRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FarmerCropRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFarmerCropRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FarmerDocumentRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFarmerDocumentRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FarmerFieldRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFarmerFieldRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FarmerProfileRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFarmerProfileRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\FeedbackRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentFeedbackRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\GovernmentSchemeRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentGovernmentSchemeRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\HarvestRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentHarvestRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\LanguageSettingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentLanguageSettingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\MandiRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentMandiRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\MarketPriceRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentMarketPriceRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\NearbyMandiRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentNearbyMandiRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\NotificationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentNotificationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\NotificationSettingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentNotificationSettingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\OtpCodeRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentOtpCodeRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\PermissionRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentPermissionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\PostHarvestAnalysisRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentPostHarvestAnalysisRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\PredictionHistoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentPredictionHistoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\PricePredictionRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentPricePredictionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\RegionRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentRegionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ReportRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentReportRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\RoleRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentRoleRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\RolePermissionRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentRolePermissionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\SchemeApplicationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentSchemeApplicationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\SoilHistoryRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentSoilHistoryRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\SoilTestRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentSoilTestRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\SoilTypeRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentSoilTypeRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TalukaRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTalukaRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TestimonialRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTestimonialRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ThemeSettingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentThemeSettingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TransportCalculationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTransportCalculationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TransportRouteRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTransportRouteRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTransportVehicleTypeRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TreatmentRecommendationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentTreatmentRecommendationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\UploadedFileRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentUploadedFileRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentUserRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\UserRoleRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentUserRoleRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\UserSettingRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentUserSettingRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\VillageRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentVillageRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\WeatherAlertRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentWeatherAlertRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\WeatherCacheRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentWeatherCacheRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\WeatherForecastRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentWeatherForecastRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\WeatherStationRepositoryInterface::class,
            \App\Repositories\Eloquent\EloquentWeatherStationRepository::class,
        );

    }
}