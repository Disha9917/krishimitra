<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory;

use App\Services\AIAdvisory\Contracts\AdvisoryContextBuilderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryRequestDTO;
use App\Services\ColdStorage\ColdStorageServiceInterface;
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
use DateTimeInterface;
use Illuminate\Support\Collection as SupportCollection;
use Throwable;

/**
 * Aggregates the advisory context for one request by composing the existing
 * module services. Every section is collected in isolation: a module that
 * throws, is empty or has no data never fails the advisory - it simply
 * contributes an `available: false` marker so the prompt stays truthful.
 *
 * Weather context is intentionally DB-backed only (latest cached snapshot,
 * stored forecast and persisted alerts); no provider HTTP call happens
 * while building an advisory.
 */
class AdvisoryContextBuilder implements AdvisoryContextBuilderInterface
{
    public function __construct(
        private readonly FarmerServiceInterface $farmer,
        private readonly WeatherServiceInterface $weather,
        private readonly SoilServiceInterface $soil,
        private readonly CropServiceInterface $crops,
        private readonly DiseaseServiceInterface $disease,
        private readonly MarketServiceInterface $market,
        private readonly GovernmentSchemeServiceInterface $schemes,
        private readonly EquipmentServiceInterface $equipment,
        private readonly ColdStorageServiceInterface $coldStorage,
        private readonly TransportServiceInterface $transport,
        private readonly UnifiedDashboardServiceInterface $unifiedDashboard,
    ) {}

    public function build(int $userId, AdvisoryRequestDTO $request): AdvisoryContextDTO
    {
        $sections = $this->requestSections($request);

        if (! config('ai.context_enabled')) {
            return new AdvisoryContextDTO(
                topic: $request->topic,
                advisoryType: $request->advisoryType,
                locale: $request->locale,
                sections: $sections,
            );
        }

        $this->withSection($sections, 'profile', fn (): array => $this->profileSection($userId));
        $this->withSection($sections, 'weather', fn (): array => $this->weatherSection($userId, $request));
        $this->withSection($sections, 'soil', fn (): array => $this->soil->soilDashboard($userId));
        $this->withSection($sections, 'crop', fn (): array => $this->cropSection($userId));
        $this->withSection($sections, 'disease', fn (): array => $this->disease->diseaseDashboard($userId));
        $this->withSection($sections, 'market', fn (): array => $this->market->marketDashboard([]));
        $this->withSection(
            $sections,
            'governmentSchemes',
            fn (): array => $this->schemes->schemeDashboard($userId, (int) config('ai.context_scheme_eligibility_limit')),
        );
        $this->withSection($sections, 'equipment', fn (): array => $this->equipment->dashboard($userId));
        $this->withSection($sections, 'coldStorage', fn (): array => $this->coldStorage->dashboard($userId));
        $this->withSection($sections, 'transport', fn (): array => $this->transport->dashboard($userId));
        $this->withSection($sections, 'dashboard', fn (): array => $this->unifiedDashboard->unifiedDashboard($userId));

        return new AdvisoryContextDTO(
            topic: $request->topic,
            advisoryType: $request->advisoryType,
            locale: $request->locale,
            sections: $sections,
        );
    }

    /**
     * Client-provided context is kept as-is so the farmer's explicit hints
     * (crop, season, location, ...) always reach the prompt.
     *
     * @return array<string, array<string, mixed>>
     */
    private function requestSections(AdvisoryRequestDTO $request): array
    {
        $sections = [];

        foreach ($request->context as $key => $value) {
            $sections[(string) $key] = is_array($value) ? $value : ['value' => $value];
        }

        return $sections;
    }

    /**
     * Collect one section in isolation; failures never propagate. When the
     * client already provided a value for the same key, it is preserved
     * under a `requested` marker so the hint still reaches the prompt.
     *
     * @param  array<string, array<string, mixed>>  $sections
     */
    private function withSection(array &$sections, string $name, callable $collect): void
    {
        $requested = $sections[$name] ?? null;

        try {
            $section = $this->normalize($collect());
        } catch (Throwable) {
            $section = [
                'available' => false,
                'reason' => ucfirst($name).' context is temporarily unavailable.',
            ];
        }

        $sections[$name] = $requested !== null ? ['requested' => $requested] + $section : $section;
    }

    /**
     * @return array<string, mixed>
     */
    private function profileSection(int $userId): array
    {
        $profile = $this->farmer->getProfile($userId);

        return [
            'profile' => $profile !== null ? [
                'farm_size_acres' => $profile->farm_size_acres !== null ? (float) $profile->farm_size_acres : null,
                'pincode' => (string) $profile->pincode,
                'state' => $profile->state,
                'district_id' => $profile->district_id !== null ? (int) $profile->district_id : null,
                'village' => $profile->village,
                'preferred_language' => $profile->user?->preferred_language,
            ] : null,
            'fields' => $this->farmer->fieldsForUser($userId)
                ->map(fn ($field): array => [
                    'id' => (int) $field->id,
                    'name' => $field->name,
                    'size_acres' => $field->size_acres !== null ? (float) $field->size_acres : null,
                    'soil_type_id' => $field->soil_type_id,
                    'current_crop_id' => $field->current_crop_id,
                    'lat' => $field->lat !== null ? (float) $field->lat : null,
                    'lng' => $field->lng !== null ? (float) $field->lng : null,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * DB-backed weather context only: the latest cached snapshot, the stored
     * forecast for today, the recent history and any active alerts. No
     * provider HTTP call is made while building an advisory.
     *
     * @return array<string, mixed>
     */
    private function weatherSection(int $userId, AdvisoryRequestDTO $request): array
    {
        $location = $this->resolveLocation($userId, $request);
        $districtId = $this->resolveDistrictId($userId, $request);

        if ($location === null) {
            return [
                'available' => false,
                'reason' => 'No location available for this farmer.',
            ];
        }

        [$lat, $lng] = $location;
        $locationKey = $this->weather->locationKey($lat, $lng);

        $current = $this->weather->getCurrentWeather($locationKey);
        $today = $this->weather->getForecast($locationKey);
        $history = $this->weather->getWeatherHistory($locationKey, 7);
        $alerts = $this->weather->activeWeatherAlerts($districtId);

        return [
            'available' => true,
            'location_key' => $locationKey,
            'lat' => $lat,
            'lng' => $lng,
            'district_id' => $districtId,
            'current' => $current,
            'today_forecast' => $today,
            'history_7_days' => $history,
            'active_alerts' => $alerts,
        ];
    }

    /**
     * Location priority: explicit request hint, then the farmer's first
     * field with coordinates.
     *
     * @return array{0: float, 1: float}|null
     */
    private function resolveLocation(int $userId, AdvisoryRequestDTO $request): ?array
    {
        $lat = $this->numberHint($request, 'lat');
        $lng = $this->numberHint($request, 'lng');

        if ($lat !== null && $lng !== null) {
            return [$lat, $lng];
        }

        foreach ($this->farmer->fieldsForUser($userId) as $field) {
            if ($field->lat !== null && $field->lng !== null) {
                return [(float) $field->lat, (float) $field->lng];
            }
        }

        return null;
    }

    private function resolveDistrictId(int $userId, AdvisoryRequestDTO $request): ?int
    {
        $hint = $this->numberHint($request, 'district_id') ?? $this->numberHint($request, 'districtId');

        if ($hint !== null) {
            return (int) $hint;
        }

        return $this->farmer->getProfile($userId)?->district_id !== null
            ? (int) $this->farmer->getProfile($userId)->district_id
            : null;
    }

    private function numberHint(AdvisoryRequestDTO $request, string $key): ?float
    {
        $value = $request->context[$key] ?? null;

        if ($value === null || ! is_numeric($value)) {
            return null;
        }

        return (float) $value;
    }

    /**
     * @return array<string, mixed>
     */
    private function cropSection(int $userId): array
    {
        $active = $this->crops->activeCropsForUser($userId);

        return [
            'summary' => $this->crops->dashboardCropSummary($userId),
            'active_crops' => $active->map(fn ($crop): array => [
                'id' => (int) $crop->id,
                'crop_id' => $crop->crop_id,
                'crop_name' => $crop->crop?->name,
                'field_id' => $crop->field_id,
                'season' => $crop->season,
                'sowing_date' => $crop->sowing_date?->toDateString(),
                'expected_harvest_date' => $crop->expected_harvest_date?->toDateString(),
                'is_current' => $crop->is_current,
            ])->values()->all(),
        ];
    }

    /**
     * Convert models, collections, DTOs and dates into plain scalar/array
     * values so the prompt builder never has to deal with objects.
     */
    private function normalize(mixed $value): mixed
    {
        if ($value instanceof SupportCollection) {
            return $value->map(fn ($item): mixed => $this->normalize($item))->values()->all();
        }

        if ($value instanceof DateTimeInterface) {
            return $value->format(DateTimeInterface::ATOM);
        }

        if (is_object($value)) {
            if (method_exists($value, 'toArray')) {
                return $this->normalize($value->toArray());
            }

            return $this->normalize(get_object_vars($value));
        }

        if (is_array($value)) {
            $normalized = [];

            foreach ($value as $key => $item) {
                $normalized[$key] = $this->normalize($item);
            }

            return $normalized;
        }

        return $value;
    }
}
