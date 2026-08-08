<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Services\ColdStorage\ColdStorageServiceInterface;
use App\Services\Common\ActivityLogServiceInterface;
use App\Services\Crop\CropServiceInterface;
use App\Services\Dashboard\UnifiedDashboardServiceInterface;
use App\Services\Disease\DiseaseServiceInterface;
use App\Services\Equipment\EquipmentServiceInterface;
use App\Services\Farmer\FarmerServiceInterface;
use App\Services\GovernmentScheme\GovernmentSchemeServiceInterface;
use App\Services\Market\MarketServiceInterface;
use App\Services\Soil\SoilServiceInterface;
use App\Services\Transport\TransportServiceInterface;
use App\Services\Weather\WeatherServiceInterface;
use DomainException;
use Throwable;

/**
 * Builds the data snapshot for each report type by reusing the owning module
 * services — no business logic is duplicated here, only composed.
 */
class ReportDataBuilder
{
    public function __construct(
        private readonly FarmerServiceInterface $farmer,
        private readonly CropServiceInterface $crops,
        private readonly SoilServiceInterface $soil,
        private readonly WeatherServiceInterface $weather,
        private readonly DiseaseServiceInterface $disease,
        private readonly MarketServiceInterface $market,
        private readonly GovernmentSchemeServiceInterface $schemes,
        private readonly EquipmentServiceInterface $equipment,
        private readonly ColdStorageServiceInterface $coldStorage,
        private readonly TransportServiceInterface $transport,
        private readonly UnifiedDashboardServiceInterface $dashboard,
        private readonly ActivityLogServiceInterface $activities,
    ) {
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function build(string $reportType, int $userId, array $filters): array
    {
        $builder = match ($reportType) {
            'farmer_profile' => fn (): array => $this->farmerReport($userId),
            'crop' => fn (): array => $this->cropReport($userId),
            'soil_health' => fn (): array => $this->soilReport($userId),
            'weather' => fn (): array => $this->weatherReport($userId),
            'disease_detection' => fn (): array => $this->diseaseReport($userId),
            'market_mandi' => fn (): array => $this->marketReport($filters),
            'government_scheme' => fn (): array => $this->schemeReport($userId),
            'equipment_rental' => fn (): array => $this->equipmentReport($userId),
            'cold_storage' => fn (): array => $this->coldStorageReport($userId),
            'transport' => fn (): array => $this->transportReport($userId),
            'unified_dashboard' => fn (): array => $this->dashboardReport($userId),
            'custom' => fn (): array => $this->customReport($userId, $filters),
            default => throw new DomainException(sprintf('Report type [%s] is not supported.', $reportType)),
        };

        return [
            'meta' => [
                'report_type' => $reportType,
                'category' => (string) config('report.types.'.$reportType),
                'generated_at' => now()->toISOString(),
                'farmer_id' => $userId,
                'filters' => $filters,
            ],
            'content' => $builder(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function farmerReport(int $userId): array
    {
        $dashboard = $this->farmer->dashboard($userId);

        return [
            'farmer_details' => $dashboard->profile?->toArray(),
            'fields' => $dashboard->fields->map->toArray()->values()->all(),
            'crops_count' => $dashboard->crops->count(),
            'harvests_count' => $dashboard->harvests->count(),
            'total_harvest_kg' => round((float) $dashboard->harvests->sum('quantity_kg'), 2),
            'detections_count' => $dashboard->detections->count(),
            'unread_notifications' => $dashboard->unreadCount,
            'activities' => $this->activities->logsForUser($userId, 20)->map->toArray()->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function cropReport(int $userId): array
    {
        return $this->crops->dashboardCropSummary($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function soilReport(int $userId): array
    {
        return $this->soil->soilDashboard($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function weatherReport(int $userId): array
    {
        $profile = $this->farmer->getProfile($userId);
        $field = $this->farmer->fieldsForUser($userId)
            ->where('lat', '!==', null)
            ->where('lng', '!==', null)
            ->first();

        if ($field === null || $field->lat === null || $field->lng === null) {
            return [
                'available' => false,
                'reason' => 'No location available for this farmer.',
            ];
        }

        try {
            return $this->weather->farmerWeatherDashboard(
                $userId,
                (float) $field->lat,
                (float) $field->lng,
                $profile?->district_id,
            );
        } catch (Throwable) {
            return [
                'available' => false,
                'reason' => 'Weather data is temporarily unavailable.',
            ];
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function diseaseReport(int $userId): array
    {
        return $this->disease->diseaseDashboard($userId);
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    private function marketReport(array $filters): array
    {
        return $this->market->marketDashboard($this->marketFilters($filters));
    }

    /**
     * @return array<string, mixed>
     */
    private function schemeReport(int $userId): array
    {
        return $this->schemes->schemeDashboard($userId, 30);
    }

    /**
     * @return array<string, mixed>
     */
    private function equipmentReport(int $userId): array
    {
        return $this->equipment->dashboard($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function coldStorageReport(int $userId): array
    {
        return $this->coldStorage->dashboard($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function transportReport(int $userId): array
    {
        return $this->transport->dashboard($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function dashboardReport(int $userId): array
    {
        return $this->dashboard->unifiedDashboard($userId);
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    private function customReport(int $userId, array $filters): array
    {
        $payload = $this->dashboard->unifiedDashboard($userId);
        $sections = $filters['sections'] ?? null;

        if (is_string($sections) && $sections !== '') {
            $payload = array_intersect_key($payload, array_flip(explode(',', $sections)));
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    private function marketFilters(array $filters): array
    {
        return array_intersect_key($filters, array_flip([
            'crop_id',
            'mandi_id',
            'district_id',
            'taluka_id',
            'from',
            'to',
        ]));
    }
}
