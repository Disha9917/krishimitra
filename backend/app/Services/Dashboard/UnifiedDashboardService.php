<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\Models\Notification;
use App\Services\ColdStorage\ColdStorageServiceInterface;
use App\Services\Common\DTO\FarmerDashboardDTO;
use App\Services\Crop\CropServiceInterface;
use App\Services\Disease\DiseaseServiceInterface;
use App\Services\Equipment\EquipmentServiceInterface;
use App\Services\Farmer\FarmerServiceInterface;
use App\Services\GovernmentScheme\GovernmentSchemeServiceInterface;
use App\Services\Market\MarketServiceInterface;
use App\Services\Notification\NotificationServiceInterface;
use App\Services\Soil\SoilServiceInterface;
use App\Services\Transport\TransportServiceInterface;
use App\Services\Weather\WeatherServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Throwable;

/**
 * Aggregates every module dashboard into a single cacheable payload.
 *
 * Each section delegates to the owning module service so no business logic
 * is duplicated; the dashboard only composes results and caches the summary
 * with a configurable TTL. The cache is invalidated by
 * App\Observers\UnifiedDashboardCacheObserver whenever a module record
 * changes for the farmer (or a booking touches their equipment/storage/vehicle).
 */
class UnifiedDashboardService implements UnifiedDashboardServiceInterface
{
    public function __construct(
        private readonly FarmerServiceInterface $farmer,
        private readonly CropServiceInterface $crops,
        private readonly WeatherServiceInterface $weather,
        private readonly SoilServiceInterface $soil,
        private readonly DiseaseServiceInterface $disease,
        private readonly MarketServiceInterface $market,
        private readonly GovernmentSchemeServiceInterface $schemes,
        private readonly EquipmentServiceInterface $equipment,
        private readonly ColdStorageServiceInterface $coldStorage,
        private readonly TransportServiceInterface $transport,
        private readonly NotificationServiceInterface $notifications,
    ) {
    }

    public function unifiedDashboard(int $userId): array
    {
        $key = $this->cacheKey($userId);

        if (config('dashboard.enabled') && Cache::has($key)) {
            $payload = Cache::get($key);
            $payload['cached'] = true;

            return $payload;
        }

        $payload = $this->build($userId);
        $payload['cached'] = false;

        if (config('dashboard.enabled')) {
            Cache::put($key, $payload, now()->addSeconds((int) config('dashboard.ttl')));
        }

        return $payload;
    }

    public function refreshUnifiedDashboard(int $userId): array
    {
        Cache::forget($this->cacheKey($userId));

        return $this->unifiedDashboard($userId);
    }

    public function cacheKey(int $userId): string
    {
        return (string) config('dashboard.prefix').$userId;
    }

    /**
     * @return array<string, mixed>
     */
    private function build(int $userId): array
    {
        $farmer = $this->farmer->dashboard($userId);
        $profile = $farmer->profile;

        $crop = $this->crops->dashboardCropSummary($userId);
        $soil = $this->soil->soilDashboard($userId);
        $disease = $this->disease->diseaseDashboard($userId);
        $market = $this->market->marketDashboard([]);
        $schemes = $this->schemes->schemeDashboard($userId, (int) config('dashboard.scheme_eligibility_limit'));
        $equipment = $this->equipment->dashboard($userId);
        $coldStorage = $this->coldStorage->dashboard($userId);
        $transport = $this->transport->dashboard($userId);

        $unread = $this->notifications->unreadNotifications($userId);

        return [
            'overview' => $this->overviewSection($farmer, $crop),
            'weather' => $this->weatherSection($userId, $profile?->district_id, $farmer->fields),
            'soil' => $soil,
            'crop' => $crop,
            'disease' => $disease,
            'market' => $market,
            'schemes' => $schemes,
            'equipment' => $equipment,
            'coldStorage' => $coldStorage,
            'transport' => $transport,
            'notifications' => [
                'unread_count' => $unread->count(),
                'recent' => $unread->take(5)->values()->map(
                    fn (Notification $notification): array => [
                        'id' => (int) $notification->id,
                        'type' => (string) $notification->type,
                        'title' => (string) $notification->title,
                        'message' => (string) $notification->message,
                        'read_at' => $notification->read_at?->toISOString(),
                        'created_at' => $notification->created_at?->toISOString(),
                    ],
                )->all(),
                'by_type' => $unread->groupBy('type')->map(
                    fn ($group): int => $group->count(),
                )->all(),
            ],
            'quickActions' => $this->quickActionsSection($farmer->fields, $crop, $schemes),
            'statistics' => $this->statisticsSection($farmer, $crop, $soil, $disease, $equipment, $coldStorage, $transport, $unread),
            'generated_at' => now()->toISOString(),
        ];
    }

    /**
     * @param  array<string, mixed>  $crop
     * @return array<string, mixed>
     */
    private function overviewSection(FarmerDashboardDTO $farmer, array $crop): array
    {
        $profile = $farmer->profile;

        return [
            'profile' => $profile !== null ? [
                'farm_size_acres' => $profile->farm_size_acres !== null ? (float) $profile->farm_size_acres : null,
                'pincode' => (string) $profile->pincode,
                'state' => $profile->state,
                'district_id' => $profile->district_id !== null ? (int) $profile->district_id : null,
                'village' => $profile->village,
            ] : null,
            'fields_count' => $farmer->fields->count(),
            'crops_count' => (int) ($crop['total_crops'] ?? 0),
            'active_crops' => (int) ($crop['active_crops'] ?? 0),
            'harvest_total_kg' => (float) ($crop['total_harvest_quantity_kg'] ?? 0),
            'unread_notifications' => $farmer->unreadCount,
            'recent_detections_count' => $farmer->detections->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function weatherSection(int $userId, ?int $districtId, Collection $fields): array
    {
        $field = $fields
            ->where('lat', '!==', null)
            ->where('lng', '!==', null)
            ->first()
            ?? $fields->first();

        if ($field === null || $field->lat === null || $field->lng === null) {
            return [
                'available' => false,
                'reason' => 'No location available for this farmer.',
            ];
        }

        try {
            $dashboard = $this->weather->farmerWeatherDashboard(
                $userId,
                (float) $field->lat,
                (float) $field->lng,
                $districtId,
            );
        } catch (Throwable) {
            return [
                'available' => false,
                'reason' => 'Weather data is temporarily unavailable.',
            ];
        }

        return [
            'available' => true,
            'current' => $dashboard['current'] ?? null,
            'today_forecast' => $dashboard['todayForecast'] ?? null,
            'alerts' => $dashboard['alerts'] ?? [],
            'summary' => $dashboard['summary'] ?? null,
        ];
    }

    /**
     * @param  Collection<int, \App\Models\FarmerField>  $fields
     * @param  array<string, mixed>  $crop
     * @param  array<string, mixed>  $schemes
     * @return array<int, array<string, mixed>>
     */
    private function quickActionsSection(Collection $fields, array $crop, array $schemes): array
    {
        $hasFields = $fields->isNotEmpty();
        $activeSchemes = (int) ($schemes['statistics']['active_schemes'] ?? 0);

        return [
            [
                'id' => 'add-crop',
                'label' => 'Add Crop',
                'route' => 'POST /v1/farmer/crops',
                'enabled' => $hasFields,
            ],
            [
                'id' => 'record-soil-test',
                'label' => 'Record Soil Test',
                'route' => 'POST /v1/soil/tests',
                'enabled' => $hasFields,
            ],
            [
                'id' => 'scan-disease',
                'label' => 'Scan Disease Image',
                'route' => 'POST /v1/disease/detections',
                'enabled' => true,
            ],
            [
                'id' => 'view-market-prices',
                'label' => 'View Market Prices',
                'route' => 'GET /v1/market/today',
                'enabled' => true,
            ],
            [
                'id' => 'apply-scheme',
                'label' => 'Apply for Scheme',
                'route' => 'POST /v1/schemes/{schemeId}/apply',
                'enabled' => $activeSchemes > 0,
            ],
            [
                'id' => 'book-equipment',
                'label' => 'Book Equipment',
                'route' => 'POST /v1/equipment/bookings',
                'enabled' => true,
            ],
            [
                'id' => 'book-cold-storage',
                'label' => 'Book Cold Storage',
                'route' => 'POST /v1/cold-storage/bookings',
                'enabled' => true,
            ],
            [
                'id' => 'request-transport',
                'label' => 'Request Transport',
                'route' => 'POST /v1/transport/bookings',
                'enabled' => true,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $crop
     * @param  array<string, mixed>  $soil
     * @param  array<string, mixed>  $disease
     * @param  array<string, mixed>  $equipment
     * @param  array<string, mixed>  $coldStorage
     * @param  array<string, mixed>  $transport
     * @return array<string, mixed>
     */
    private function statisticsSection(
        FarmerDashboardDTO $farmer,
        array $crop,
        array $soil,
        array $disease,
        array $equipment,
        array $coldStorage,
        array $transport,
        Collection $unread,
    ): array {
        return [
            'fields' => $farmer->fields->count(),
            'crops_total' => (int) ($crop['total_crops'] ?? 0),
            'crops_active' => (int) ($crop['active_crops'] ?? 0),
            'crops_planned' => (int) ($crop['planned_crops'] ?? 0),
            'crops_overdue' => (int) ($crop['overdue_crops'] ?? 0),
            'harvest_total_kg' => (float) ($crop['total_harvest_quantity_kg'] ?? 0),
            'harvest_count' => (int) ($crop['total_harvest_count'] ?? 0),
            'average_yield_per_acre' => $crop['average_yield_per_acre'] ?? null,
            'soil_tests' => (int) ($soil['tests_count'] ?? 0),
            'soil_average_health_score' => $soil['average_health_score'] ?? null,
            'disease_detections' => (int) ($disease['statistics']['total_detections'] ?? 0),
            'disease_active_cases' => (int) ($disease['statistics']['active_cases'] ?? 0),
            'equipment_listed' => (int) ($equipment['statistics']['total_equipment'] ?? 0),
            'equipment_active_rentals' => (int) ($equipment['statistics']['active_rentals'] ?? 0),
            'cold_storage_capacity_tonnes' => (float) ($coldStorage['statistics']['capacity_tonnes'] ?? 0),
            'cold_storage_occupied_tonnes' => (float) ($coldStorage['statistics']['occupied_tonnes'] ?? 0),
            'transport_vehicles' => (int) ($transport['statistics']['total_vehicles'] ?? 0),
            'transport_my_bookings' => (int) ($transport['statistics']['my_bookings_count'] ?? 0),
            'unread_notifications' => $unread->count(),
        ];
    }
}
