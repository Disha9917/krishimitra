<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use App\Repositories\Contracts\ChatHistoryRepositoryInterface;
use App\Repositories\Contracts\ColdStorageBookingRepositoryInterface;
use App\Repositories\Contracts\ColdStorageRepositoryInterface;
use App\Repositories\Contracts\ContactRequestRepositoryInterface;
use App\Repositories\Contracts\CropCalendarRepositoryInterface;
use App\Repositories\Contracts\CropRecommendationRepositoryInterface;
use App\Repositories\Contracts\CropRepositoryInterface;
use App\Repositories\Contracts\CropVarietyRepositoryInterface;
use App\Repositories\Contracts\DashboardAnalyticRepositoryInterface;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use App\Repositories\Contracts\DiseaseHistoryRepositoryInterface;
use App\Repositories\Contracts\DiseaseImageRepositoryInterface;
use App\Repositories\Contracts\DiseaseRepositoryInterface;
use App\Repositories\Contracts\DistrictCropMapRepositoryInterface;
use App\Repositories\Contracts\DistrictRepositoryInterface;
use App\Repositories\Contracts\EquipmentBookingRepositoryInterface;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use App\Repositories\Contracts\ExportHistoryRepositoryInterface;
use App\Repositories\Contracts\FaqRepositoryInterface;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use App\Repositories\Contracts\FarmerDocumentRepositoryInterface;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;
use App\Repositories\Contracts\FeedbackRepositoryInterface;
use App\Repositories\Contracts\GovernmentSchemeRepositoryInterface;
use App\Repositories\Contracts\ImportHistoryRepositoryInterface;
use App\Repositories\Contracts\ImportLogRepositoryInterface;
use App\Repositories\Contracts\ImportWriteRepositoryInterface;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use App\Repositories\Contracts\LanguageSettingRepositoryInterface;
use App\Repositories\Contracts\MandiRepositoryInterface;
use App\Repositories\Contracts\MarketPriceRepositoryInterface;
use App\Repositories\Contracts\NearbyMandiRepositoryInterface;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\NotificationSettingRepositoryInterface;
use App\Repositories\Contracts\OtpCodeRepositoryInterface;
use App\Repositories\Contracts\PermissionRepositoryInterface;
use App\Repositories\Contracts\PostHarvestAnalysisRepositoryInterface;
use App\Repositories\Contracts\PredictionHistoryRepositoryInterface;
use App\Repositories\Contracts\PricePredictionRepositoryInterface;
use App\Repositories\Contracts\RegionRepositoryInterface;
use App\Repositories\Contracts\ReportRepositoryInterface;
use App\Repositories\Contracts\RolePermissionRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\SchemeApplicationRepositoryInterface;
use App\Repositories\Contracts\SoilHistoryRepositoryInterface;
use App\Repositories\Contracts\SoilTestRepositoryInterface;
use App\Repositories\Contracts\SoilTypeRepositoryInterface;
use App\Repositories\Contracts\TalukaRepositoryInterface;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use App\Repositories\Contracts\ThemeSettingRepositoryInterface;
use App\Repositories\Contracts\TransportBookingRepositoryInterface;
use App\Repositories\Contracts\TransportCalculationRepositoryInterface;
use App\Repositories\Contracts\TransportRouteRepositoryInterface;
use App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface;
use App\Repositories\Contracts\TreatmentRecommendationRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\UserRoleRepositoryInterface;
use App\Repositories\Contracts\UserSettingRepositoryInterface;
use App\Repositories\Contracts\VehicleRepositoryInterface;
use App\Repositories\Contracts\VillageRepositoryInterface;
use App\Repositories\Contracts\WeatherAlertRepositoryInterface;
use App\Repositories\Contracts\WeatherCacheRepositoryInterface;
use App\Repositories\Contracts\WeatherForecastRepositoryInterface;
use App\Repositories\Contracts\WeatherHourlyForecastRepositoryInterface;
use App\Repositories\Contracts\WeatherStationRepositoryInterface;
use App\Repositories\Eloquent\EloquentActivityLogRepository;
use App\Repositories\Eloquent\EloquentAiAdvisoryRepository;
use App\Repositories\Eloquent\EloquentAuditLogRepository;
use App\Repositories\Eloquent\EloquentChatHistoryRepository;
use App\Repositories\Eloquent\EloquentColdStorageBookingRepository;
use App\Repositories\Eloquent\EloquentColdStorageRepository;
use App\Repositories\Eloquent\EloquentContactRequestRepository;
use App\Repositories\Eloquent\EloquentCropCalendarRepository;
use App\Repositories\Eloquent\EloquentCropRecommendationRepository;
use App\Repositories\Eloquent\EloquentCropRepository;
use App\Repositories\Eloquent\EloquentCropVarietyRepository;
use App\Repositories\Eloquent\EloquentDashboardAnalyticRepository;
use App\Repositories\Eloquent\EloquentDiseaseDetectionRepository;
use App\Repositories\Eloquent\EloquentDiseaseHistoryRepository;
use App\Repositories\Eloquent\EloquentDiseaseImageRepository;
use App\Repositories\Eloquent\EloquentDiseaseRepository;
use App\Repositories\Eloquent\EloquentDistrictCropMapRepository;
use App\Repositories\Eloquent\EloquentDistrictRepository;
use App\Repositories\Eloquent\EloquentEquipmentBookingRepository;
use App\Repositories\Eloquent\EloquentEquipmentRepository;
use App\Repositories\Eloquent\EloquentExportHistoryRepository;
use App\Repositories\Eloquent\EloquentFaqRepository;
use App\Repositories\Eloquent\EloquentFarmerCropRepository;
use App\Repositories\Eloquent\EloquentFarmerDocumentRepository;
use App\Repositories\Eloquent\EloquentFarmerFieldRepository;
use App\Repositories\Eloquent\EloquentFarmerProfileRepository;
use App\Repositories\Eloquent\EloquentFeedbackRepository;
use App\Repositories\Eloquent\EloquentGovernmentSchemeRepository;
use App\Repositories\Eloquent\EloquentImportHistoryRepository;
use App\Repositories\Eloquent\EloquentImportLogRepository;
use App\Repositories\Eloquent\EloquentImportWriteRepository;
use App\Repositories\Eloquent\EloquentHarvestRepository;
use App\Repositories\Eloquent\EloquentLanguageSettingRepository;
use App\Repositories\Eloquent\EloquentMandiRepository;
use App\Repositories\Eloquent\EloquentMarketPriceRepository;
use App\Repositories\Eloquent\EloquentNearbyMandiRepository;
use App\Repositories\Eloquent\EloquentNotificationRepository;
use App\Repositories\Eloquent\EloquentNotificationSettingRepository;
use App\Repositories\Eloquent\EloquentOtpCodeRepository;
use App\Repositories\Eloquent\EloquentPermissionRepository;
use App\Repositories\Eloquent\EloquentPostHarvestAnalysisRepository;
use App\Repositories\Eloquent\EloquentPredictionHistoryRepository;
use App\Repositories\Eloquent\EloquentPricePredictionRepository;
use App\Repositories\Eloquent\EloquentRegionRepository;
use App\Repositories\Eloquent\EloquentReportRepository;
use App\Repositories\Eloquent\EloquentRolePermissionRepository;
use App\Repositories\Eloquent\EloquentRoleRepository;
use App\Repositories\Eloquent\EloquentSchemeApplicationRepository;
use App\Repositories\Eloquent\EloquentSoilHistoryRepository;
use App\Repositories\Eloquent\EloquentSoilTestRepository;
use App\Repositories\Eloquent\EloquentSoilTypeRepository;
use App\Repositories\Eloquent\EloquentTalukaRepository;
use App\Repositories\Eloquent\EloquentTestimonialRepository;
use App\Repositories\Eloquent\EloquentThemeSettingRepository;
use App\Repositories\Eloquent\EloquentTransportCalculationRepository;
use App\Repositories\Eloquent\EloquentTransportBookingRepository;
use App\Repositories\Eloquent\EloquentTransportRouteRepository;
use App\Repositories\Eloquent\EloquentTransportVehicleTypeRepository;
use App\Repositories\Eloquent\EloquentTreatmentRecommendationRepository;
use App\Repositories\Eloquent\EloquentUploadedFileRepository;
use App\Repositories\Eloquent\EloquentUserRepository;
use App\Repositories\Eloquent\EloquentUserRoleRepository;
use App\Repositories\Eloquent\EloquentUserSettingRepository;
use App\Repositories\Eloquent\EloquentVehicleRepository;
use App\Repositories\Eloquent\EloquentVillageRepository;
use App\Repositories\Eloquent\EloquentWeatherAlertRepository;
use App\Repositories\Eloquent\EloquentWeatherCacheRepository;
use App\Repositories\Eloquent\EloquentWeatherForecastRepository;
use App\Repositories\Eloquent\EloquentWeatherHourlyForecastRepository;
use App\Repositories\Eloquent\EloquentWeatherStationRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register every repository interface with its Eloquent implementation.
     */
    public function register(): void
    {
        $this->app->bind(
            ActivityLogRepositoryInterface::class,
            EloquentActivityLogRepository::class,
        );

        $this->app->bind(
            AiAdvisoryRepositoryInterface::class,
            EloquentAiAdvisoryRepository::class,
        );

        $this->app->bind(
            AuditLogRepositoryInterface::class,
            EloquentAuditLogRepository::class,
        );

        $this->app->bind(
            ChatHistoryRepositoryInterface::class,
            EloquentChatHistoryRepository::class,
        );

        $this->app->bind(
            ColdStorageRepositoryInterface::class,
            EloquentColdStorageRepository::class,
        );

        $this->app->bind(
            ColdStorageBookingRepositoryInterface::class,
            EloquentColdStorageBookingRepository::class,
        );

        $this->app->bind(
            ContactRequestRepositoryInterface::class,
            EloquentContactRequestRepository::class,
        );

        $this->app->bind(
            CropRepositoryInterface::class,
            EloquentCropRepository::class,
        );

        $this->app->bind(
            CropCalendarRepositoryInterface::class,
            EloquentCropCalendarRepository::class,
        );

        $this->app->bind(
            CropRecommendationRepositoryInterface::class,
            EloquentCropRecommendationRepository::class,
        );

        $this->app->bind(
            CropVarietyRepositoryInterface::class,
            EloquentCropVarietyRepository::class,
        );

        $this->app->bind(
            DashboardAnalyticRepositoryInterface::class,
            EloquentDashboardAnalyticRepository::class,
        );

        $this->app->bind(
            DiseaseRepositoryInterface::class,
            EloquentDiseaseRepository::class,
        );

        $this->app->bind(
            DiseaseDetectionRepositoryInterface::class,
            EloquentDiseaseDetectionRepository::class,
        );

        $this->app->bind(
            DiseaseHistoryRepositoryInterface::class,
            EloquentDiseaseHistoryRepository::class,
        );

        $this->app->bind(
            DiseaseImageRepositoryInterface::class,
            EloquentDiseaseImageRepository::class,
        );

        $this->app->bind(
            DistrictRepositoryInterface::class,
            EloquentDistrictRepository::class,
        );

        $this->app->bind(
            DistrictCropMapRepositoryInterface::class,
            EloquentDistrictCropMapRepository::class,
        );

        $this->app->bind(
            EquipmentRepositoryInterface::class,
            EloquentEquipmentRepository::class,
        );

        $this->app->bind(
            EquipmentBookingRepositoryInterface::class,
            EloquentEquipmentBookingRepository::class,
        );

        $this->app->bind(
            ExportHistoryRepositoryInterface::class,
            EloquentExportHistoryRepository::class,
        );

        $this->app->bind(
            FaqRepositoryInterface::class,
            EloquentFaqRepository::class,
        );

        $this->app->bind(
            FarmerCropRepositoryInterface::class,
            EloquentFarmerCropRepository::class,
        );

        $this->app->bind(
            FarmerDocumentRepositoryInterface::class,
            EloquentFarmerDocumentRepository::class,
        );

        $this->app->bind(
            FarmerFieldRepositoryInterface::class,
            EloquentFarmerFieldRepository::class,
        );

        $this->app->bind(
            FarmerProfileRepositoryInterface::class,
            EloquentFarmerProfileRepository::class,
        );

        $this->app->bind(
            FeedbackRepositoryInterface::class,
            EloquentFeedbackRepository::class,
        );

        $this->app->bind(
            GovernmentSchemeRepositoryInterface::class,
            EloquentGovernmentSchemeRepository::class,
        );

        $this->app->bind(
            HarvestRepositoryInterface::class,
            EloquentHarvestRepository::class,
        );

        $this->app->bind(
            LanguageSettingRepositoryInterface::class,
            EloquentLanguageSettingRepository::class,
        );

        $this->app->bind(
            MandiRepositoryInterface::class,
            EloquentMandiRepository::class,
        );

        $this->app->bind(
            MarketPriceRepositoryInterface::class,
            EloquentMarketPriceRepository::class,
        );

        $this->app->bind(
            NearbyMandiRepositoryInterface::class,
            EloquentNearbyMandiRepository::class,
        );

        $this->app->bind(
            NotificationRepositoryInterface::class,
            EloquentNotificationRepository::class,
        );

        $this->app->bind(
            NotificationSettingRepositoryInterface::class,
            EloquentNotificationSettingRepository::class,
        );

        $this->app->bind(
            OtpCodeRepositoryInterface::class,
            EloquentOtpCodeRepository::class,
        );

        $this->app->bind(
            PermissionRepositoryInterface::class,
            EloquentPermissionRepository::class,
        );

        $this->app->bind(
            PostHarvestAnalysisRepositoryInterface::class,
            EloquentPostHarvestAnalysisRepository::class,
        );

        $this->app->bind(
            PredictionHistoryRepositoryInterface::class,
            EloquentPredictionHistoryRepository::class,
        );

        $this->app->bind(
            PricePredictionRepositoryInterface::class,
            EloquentPricePredictionRepository::class,
        );

        $this->app->bind(
            RegionRepositoryInterface::class,
            EloquentRegionRepository::class,
        );

        $this->app->bind(
            ReportRepositoryInterface::class,
            EloquentReportRepository::class,
        );

        $this->app->bind(
            RoleRepositoryInterface::class,
            EloquentRoleRepository::class,
        );

        $this->app->bind(
            RolePermissionRepositoryInterface::class,
            EloquentRolePermissionRepository::class,
        );

        $this->app->bind(
            SchemeApplicationRepositoryInterface::class,
            EloquentSchemeApplicationRepository::class,
        );

        $this->app->bind(
            SoilHistoryRepositoryInterface::class,
            EloquentSoilHistoryRepository::class,
        );

        $this->app->bind(
            SoilTestRepositoryInterface::class,
            EloquentSoilTestRepository::class,
        );

        $this->app->bind(
            SoilTypeRepositoryInterface::class,
            EloquentSoilTypeRepository::class,
        );

        $this->app->bind(
            TalukaRepositoryInterface::class,
            EloquentTalukaRepository::class,
        );

        $this->app->bind(
            TestimonialRepositoryInterface::class,
            EloquentTestimonialRepository::class,
        );

        $this->app->bind(
            ThemeSettingRepositoryInterface::class,
            EloquentThemeSettingRepository::class,
        );

        $this->app->bind(
            TransportBookingRepositoryInterface::class,
            EloquentTransportBookingRepository::class,
        );

        $this->app->bind(
            TransportCalculationRepositoryInterface::class,
            EloquentTransportCalculationRepository::class,
        );

        $this->app->bind(
            TransportRouteRepositoryInterface::class,
            EloquentTransportRouteRepository::class,
        );

        $this->app->bind(
            TransportVehicleTypeRepositoryInterface::class,
            EloquentTransportVehicleTypeRepository::class,
        );

        $this->app->bind(
            TreatmentRecommendationRepositoryInterface::class,
            EloquentTreatmentRecommendationRepository::class,
        );

        $this->app->bind(
            UploadedFileRepositoryInterface::class,
            EloquentUploadedFileRepository::class,
        );

        $this->app->bind(
            VehicleRepositoryInterface::class,
            EloquentVehicleRepository::class,
        );

        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class,
        );

        $this->app->bind(
            UserRoleRepositoryInterface::class,
            EloquentUserRoleRepository::class,
        );

        $this->app->bind(
            UserSettingRepositoryInterface::class,
            EloquentUserSettingRepository::class,
        );

        $this->app->bind(
            VillageRepositoryInterface::class,
            EloquentVillageRepository::class,
        );

        $this->app->bind(
            WeatherAlertRepositoryInterface::class,
            EloquentWeatherAlertRepository::class,
        );

        $this->app->bind(
            WeatherCacheRepositoryInterface::class,
            EloquentWeatherCacheRepository::class,
        );

        $this->app->bind(
            WeatherForecastRepositoryInterface::class,
            EloquentWeatherForecastRepository::class,
        );

        $this->app->bind(
            WeatherHourlyForecastRepositoryInterface::class,
            EloquentWeatherHourlyForecastRepository::class,
        );

        $this->app->bind(
            WeatherStationRepositoryInterface::class,
            EloquentWeatherStationRepository::class,
        );

        $this->app->bind(
            ImportHistoryRepositoryInterface::class,
            EloquentImportHistoryRepository::class,
        );

        $this->app->bind(
            ImportLogRepositoryInterface::class,
            EloquentImportLogRepository::class,
        );

        $this->app->bind(
            ImportWriteRepositoryInterface::class,
            EloquentImportWriteRepository::class,
        );

    }
}
