<?php

declare(strict_types=1);

namespace App\Services\Crop;

use App\Models\Crop;
use App\Models\CropCalendar;
use App\Models\CropRecommendation;
use App\Models\FarmerCrop;
use App\Repositories\Contracts\CropCalendarRepositoryInterface;
use App\Repositories\Contracts\CropRecommendationRepositoryInterface;
use App\Repositories\Contracts\CropRepositoryInterface;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class CropService implements CropServiceInterface
{
    /**
     * Fallback crop duration (days) when no calendar data exists.
     */
    private const DEFAULT_DURATION_DAYS = 120;

    private const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

    public function __construct(
        private readonly CropRepositoryInterface $crops,
        private readonly CropRecommendationRepositoryInterface $recommendations,
        private readonly HarvestRepositoryInterface $harvests,
        private readonly FarmerCropRepositoryInterface $farmerCrops,
        private readonly FarmerFieldRepositoryInterface $fields,
        private readonly CropCalendarRepositoryInterface $cropCalendar,
    ) {}

    public function createCrop(array $data): Crop
    {
        return $this->crops->create($data);
    }

    public function updateCrop(int $cropId, array $data): ?Crop
    {
        return $this->crops->update($cropId, $data);
    }

    public function activeCrops(): Collection
    {
        return $this->crops->activeCrops();
    }

    public function seasonalCrops(string $season): Collection
    {
        return $this->crops->seasonalCrops($season);
    }

    public function cropHistory(int $cropId, int $limit = 30): Collection
    {
        return $this->crops->cropHistory($cropId, $limit);
    }

    public function recommendCrop(string $season, int $limit = 5): Collection
    {
        return $this->crops->seasonalCrops($season)
            ->sortByDesc('avg_price_per_qtl')
            ->take($limit)
            ->values();
    }

    public function recordRecommendation(int $userId, array $inputSnapshot, array $recommendations): CropRecommendation
    {
        return $this->recommendations->create([
            'user_id' => $userId,
            'input_snapshot' => $inputSnapshot,
            'recommendations' => $recommendations,
            'selected_crop_id' => $recommendations[0]['crop_id'] ?? null,
            'generated_at' => now(),
            'model_version' => 'crop-ranker-v1',
        ]);
    }

    public function harvestSummary(int $userId): \Illuminate\Support\Collection
    {
        return $this->harvests->harvestsForFarmer($userId)
            ->groupBy('crop_id')
            ->map(function (Collection $harvests, int|string $cropId): array {
                $totalQuantity = (float) $harvests->sum('quantity_kg');
                $averageYield = $harvests->avg('yield_per_acre');

                return [
                    'crop_id' => (int) $cropId,
                    'harvest_count' => $harvests->count(),
                    'total_quantity_kg' => $totalQuantity,
                    'average_yield_per_acre' => $averageYield !== null ? (float) $averageYield : null,
                ];
            })
            ->sortByDesc('total_quantity_kg')
            ->values();
    }

    public function recordCrop(int $userId, array $data, bool $allowOverlap = false): FarmerCrop
    {
        $this->assertValidSeason($data['season'] ?? null);
        $this->assertValidDates($data['sowing_date'] ?? null, $data['expected_harvest_date'] ?? null);

        if (isset($data['field_id']) && $data['field_id'] !== null) {
            $this->assertFieldOwnership($userId, (int) $data['field_id']);
            $this->assertNoOverlap((int) $data['field_id'], null, (bool) ($data['is_current'] ?? true), $allowOverlap);
        }

        $crop = $this->farmerCrops->create([
            'user_id' => $userId,
            ...$data,
        ]);

        if ((bool) ($data['is_current'] ?? true) && isset($data['field_id']) && $data['field_id'] !== null) {
            $this->syncFieldCurrentCrop((int) $data['field_id'], (int) $crop->crop_id);
        }

        return $crop;
    }

    public function cropsForUser(int $userId): Collection
    {
        return $this->farmerCrops->cropsForUser($userId);
    }

    public function getFarmerCrop(int $userId, int $cropId): ?FarmerCrop
    {
        return $this->farmerCrops->findForUser($userId, $cropId);
    }

    public function updateFarmerCrop(int $userId, int $cropId, array $data): ?FarmerCrop
    {
        $crop = $this->assertCropOwnership($userId, $cropId);

        $sowingDate = $data['sowing_date'] ?? $crop->sowing_date?->toDateString();
        $harvestDate = $data['expected_harvest_date'] ?? $crop->expected_harvest_date?->toDateString();

        $this->assertValidSeason($data['season'] ?? $crop->season);
        $this->assertValidDates($sowingDate, $harvestDate);

        $fieldId = $data['field_id'] ?? $crop->field_id;

        if ($fieldId !== null && (int) $fieldId !== (int) $crop->field_id) {
            $this->assertFieldOwnership($userId, (int) $fieldId);
        }

        $isCurrent = (bool) ($data['is_current'] ?? (bool) $crop->is_current);

        if ($isCurrent && $fieldId !== null) {
            $this->assertNoOverlap((int) $fieldId, (int) $crop->id, true, (bool) ($data['allow_overlap'] ?? false));
        }

        $updated = $this->farmerCrops->update($cropId, $data);

        if ($updated !== null && $isCurrent && $fieldId !== null) {
            $this->syncFieldCurrentCrop((int) $fieldId, (int) $updated->crop_id);
        }

        return $updated;
    }

    public function deleteFarmerCrop(int $userId, int $cropId): bool
    {
        $crop = $this->assertCropOwnership($userId, $cropId);

        $deleted = $this->farmerCrops->delete($cropId);

        if ($deleted && $crop->field_id !== null && (bool) $crop->is_current) {
            $field = $this->fields->findById((int) $crop->field_id);

            if ($field !== null && (int) $field->current_crop_id === (int) $crop->crop_id) {
                $this->fields->update((int) $field->id, ['current_crop_id' => null]);
            }
        }

        return $deleted;
    }

    public function activeCropsForUser(int $userId): Collection
    {
        return $this->farmerCrops->activeCropsForUser($userId);
    }

    public function seasonalCropsForUser(int $userId, string $season): Collection
    {
        $this->assertValidSeason($season);

        return $this->farmerCrops->seasonalCropsForUser($userId, $season);
    }

    public function cropHistoryForUser(int $userId): Collection
    {
        return $this->farmerCrops->cropHistoryForUser($userId);
    }

    public function farmerCropTimeline(int $userId, int $cropId): ?array
    {
        $crop = $this->getFarmerCrop($userId, $cropId);

        if ($crop === null) {
            return null;
        }

        $calendar = $this->cropCalendar->calendarForCrop((int) $crop->crop_id);
        $duration = $this->cropDuration($crop);
        $today = Carbon::today();

        $stages = $calendar->isEmpty()
            ? $this->genericStages()
            : $calendar->map(fn (CropCalendar $entry): array => [
                'stage' => $entry->stage,
                'day_start' => (int) $entry->day_start,
                'day_end' => (int) ($entry->day_end ?? $entry->day_start),
                'activity' => $entry->activity,
                'is_current' => false,
            ])->all();

        $sowing = $crop->sowing_date;

        if ($sowing !== null) {
            foreach ($stages as $index => $stage) {
                $startDate = Carbon::parse($sowing)->addDays((int) $stage['day_start']);
                $endDate = Carbon::parse($sowing)->addDays((int) $stage['day_end']);
                $stages[$index]['start_date'] = $startDate->toDateString();
                $stages[$index]['end_date'] = $endDate->toDateString();
                $stages[$index]['is_current'] = $today->between($startDate->startOfDay(), $endDate->endOfDay());
            }
        }

        return [
            'crop_id' => (int) $crop->id,
            'sowing_date' => $crop->sowing_date?->toDateString(),
            'expected_harvest_date' => $crop->expected_harvest_date?->toDateString(),
            'duration_days' => $duration,
            'days_since_sowing' => $sowing !== null ? (int) $sowing->diffInDays($today, false) : 0,
            'stages' => $stages,
        ];
    }

    public function farmerCropCalendar(int $userId, ?int $year = null): array
    {
        $year ??= (int) Carbon::today()->year;

        $crops = $this->farmerCrops->cropsForUser($userId);
        $harvests = $this->harvests->harvestsForFarmer($userId);
        $calendars = $this->cropCalendarsForCrops($crops);

        $months = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthStart = Carbon::create($year, $month, 1)->startOfDay();
            $monthEnd = $monthStart->copy()->endOfMonth();

            $monthCrops = $crops->filter(fn (FarmerCrop $crop): bool => $this->overlapsMonth($crop, $monthStart, $monthEnd));

            $monthEvents = [];

            foreach ($crops as $crop) {
                if ($crop->sowing_date === null) {
                    continue;
                }

                $entryStages = $calendars[(int) $crop->crop_id] ?? collect();

                foreach ($entryStages as $entry) {
                    $eventDate = Carbon::parse($crop->sowing_date)->addDays((int) ($entry->day_start + $entry->day_end) / 2);

                    if ($eventDate->between($monthStart, $monthEnd)) {
                        $monthEvents[] = [
                            'type' => 'advisory',
                            'date' => $eventDate->toDateString(),
                            'crop_id' => (int) $crop->crop_id,
                            'crop_name' => $crop->crop?->name,
                            'stage' => $entry->stage,
                            'activity' => $entry->activity,
                        ];
                    }
                }
            }

            foreach ($harvests as $harvest) {
                if ($harvest->harvest_date?->between($monthStart, $monthEnd)) {
                    $monthEvents[] = [
                        'type' => 'harvest',
                        'date' => $harvest->harvest_date->toDateString(),
                        'crop_id' => (int) $harvest->crop_id,
                        'crop_name' => $harvest->crop?->name,
                        'quantity_kg' => (float) $harvest->quantity_kg,
                    ];
                }
            }

            $months[] = [
                'month' => $month,
                'name' => $monthStart->format('F'),
                'crops' => $monthCrops->map(fn (FarmerCrop $crop): array => [
                    'crop_id' => (int) $crop->id,
                    'crop_name' => $crop->crop?->name,
                    'field_name' => $crop->field?->name,
                    'from' => $crop->sowing_date?->toDateString(),
                    'to' => $this->cropEndDate($crop)->toDateString(),
                    'season' => $crop->season,
                ])->values()->all(),
                'events' => array_values($monthEvents),
            ];
        }

        return [
            'year' => $year,
            'months' => $months,
        ];
    }

    public function farmerCropGrowthStage(int $userId, int $cropId): ?array
    {
        $crop = $this->getFarmerCrop($userId, $cropId);

        if ($crop === null) {
            return null;
        }

        if ($crop->sowing_date === null || $crop->sowing_date->gt(Carbon::today())) {
            return [
                'crop_id' => (int) $crop->id,
                'stage' => 'planned',
                'stage_label' => 'Planned',
                'progress_percent' => 0,
                'days_since_sowing' => $crop->sowing_date !== null
                    ? (int) $crop->sowing_date->diffInDays(Carbon::today(), false)
                    : null,
                'duration_days' => $this->cropDuration($crop),
                'next_stage' => 'sowing',
            ];
        }

        $days = (int) $crop->sowing_date->diffInDays(Carbon::today(), false);
        $duration = $this->cropDuration($crop);
        $fraction = $duration > 0 ? $days / $duration : 1.0;

        $band = $this->stageForFraction($fraction);

        return [
            'crop_id' => (int) $crop->id,
            'stage' => $band['stage'],
            'stage_label' => $band['label'],
            'progress_percent' => (int) min(100, max(0, (int) round($fraction * 100))),
            'days_since_sowing' => $days,
            'duration_days' => $duration,
            'next_stage' => $band['next'],
        ];
    }

    public function farmerCropStatus(int $userId, int $cropId): ?array
    {
        $crop = $this->getFarmerCrop($userId, $cropId);

        if ($crop === null) {
            return null;
        }

        $today = Carbon::today();
        $harvested = $crop->harvests !== null && $crop->harvests->isNotEmpty();

        if ($harvested) {
            $status = 'harvested';
        } elseif ($crop->expected_harvest_date !== null && $crop->expected_harvest_date->lt($today)) {
            $status = 'overdue';
        } elseif ($crop->sowing_date !== null && $crop->sowing_date->gt($today)) {
            $status = 'planned';
        } elseif ((bool) $crop->is_current) {
            $status = 'growing';
        } else {
            $status = 'inactive';
        }

        return [
            'crop_id' => (int) $crop->id,
            'status' => $status,
            'status_label' => ucfirst($status),
            'sowing_date' => $crop->sowing_date?->toDateString(),
            'expected_harvest_date' => $crop->expected_harvest_date?->toDateString(),
            'is_overdue' => $status === 'overdue',
            'harvest_count' => $crop->harvests !== null ? $crop->harvests->count() : 0,
        ];
    }

    public function dashboardCropSummary(int $userId): array
    {
        $crops = $this->farmerCrops->cropsForUser($userId);
        $history = $this->farmerCrops->cropHistoryForUser($userId);
        $harvests = $this->harvests->harvestsForFarmer($userId);

        $today = Carbon::today();

        $bySeason = ['Kharif' => 0, 'Rabi' => 0, 'Zaid' => 0];

        foreach ($crops as $crop) {
            if (isset($bySeason[$crop->season])) {
                $bySeason[$crop->season]++;
            }
        }

        return [
            'total_crops' => $history->count(),
            'active_crops' => $crops->where('is_current', true)->count(),
            'planned_crops' => $crops->filter(fn (FarmerCrop $crop): bool => $crop->sowing_date !== null && $crop->sowing_date->gt($today))->count(),
            'overdue_crops' => $crops->filter(fn (FarmerCrop $crop): bool => $crop->expected_harvest_date !== null && $crop->expected_harvest_date->lt($today))->count(),
            'harvested_crops' => $history->filter(fn (FarmerCrop $crop): bool => $crop->harvests !== null && $crop->harvests->isNotEmpty())->count(),
            'deleted_crops' => $history->filter(fn (FarmerCrop $crop): bool => $crop->trashed())->count(),
            'by_season' => $bySeason,
            'total_harvest_quantity_kg' => (float) $harvests->sum('quantity_kg'),
            'total_harvest_count' => $harvests->count(),
            'average_yield_per_acre' => $harvests->avg('yield_per_acre') !== null ? (float) $harvests->avg('yield_per_acre') : null,
        ];
    }

    /**
     * @param  Collection<int, FarmerCrop>  $crops
     * @return array<int, Collection<int, CropCalendar>>
     */
    private function cropCalendarsForCrops(Collection $crops): array
    {
        $byCrop = [];

        foreach ($crops->pluck('crop_id')->unique()->all() as $cropId) {
            $byCrop[(int) $cropId] = $this->cropCalendar->calendarForCrop((int) $cropId);
        }

        return $byCrop;
    }

    private function overlapsMonth(FarmerCrop $crop, Carbon $monthStart, Carbon $monthEnd): bool
    {
        $from = $crop->sowing_date !== null
            ? Carbon::parse($crop->sowing_date)
            : Carbon::create($monthStart->year, $monthStart->month, 1);

        $to = $this->cropEndDate($crop);

        return $to->gte($monthStart->startOfDay()) && $from->lte($monthEnd->endOfDay());
    }

    private function cropEndDate(FarmerCrop $crop): Carbon
    {
        if ($crop->expected_harvest_date !== null) {
            return Carbon::parse($crop->expected_harvest_date)->endOfDay();
        }

        $base = $crop->sowing_date !== null ? Carbon::parse($crop->sowing_date) : Carbon::today();

        return $base->addDays($this->cropDuration($crop))->endOfDay();
    }

    private function cropDuration(FarmerCrop $crop): int
    {
        if ($crop->sowing_date !== null && $crop->expected_harvest_date !== null) {
            $duration = (int) $crop->sowing_date->diffInDays($crop->expected_harvest_date);

            if ($duration > 0) {
                return $duration;
            }
        }

        $maxDayEnd = $this->cropCalendar->calendarForCrop((int) $crop->crop_id)
            ->max('day_end');

        return $maxDayEnd !== null ? (int) $maxDayEnd : self::DEFAULT_DURATION_DAYS;
    }

    /**
     * @return array<string, mixed>
     */
    private function stageForFraction(float $fraction): array
    {
        $bands = [
            [0.05, ['stage' => 'sowing', 'label' => 'Sowing', 'next' => 'germination']],
            [0.15, ['stage' => 'germination', 'label' => 'Germination', 'next' => 'vegetative']],
            [0.45, ['stage' => 'vegetative', 'label' => 'Vegetative', 'next' => 'flowering']],
            [0.65, ['stage' => 'flowering', 'label' => 'Flowering', 'next' => 'fruiting']],
            [0.85, ['stage' => 'fruiting', 'label' => 'Fruiting', 'next' => 'harvesting']],
        ];

        foreach ($bands as [$threshold, $band]) {
            if ($fraction <= $threshold) {
                return $band;
            }
        }

        return ['stage' => 'harvesting', 'label' => 'Harvesting', 'next' => 'completed'];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function genericStages(): array
    {
        return [
            ['stage' => 'sowing', 'day_start' => 0, 'day_end' => 6, 'activity' => 'Sowing the field'],
            ['stage' => 'germination', 'day_start' => 7, 'day_end' => 20, 'activity' => 'Monitor germination'],
            ['stage' => 'vegetative', 'day_start' => 21, 'day_end' => 59, 'activity' => 'Apply fertilizer and irrigation'],
            ['stage' => 'flowering', 'day_start' => 60, 'day_end' => 89, 'activity' => 'Pest control and pollination care'],
            ['stage' => 'fruiting', 'day_start' => 90, 'day_end' => 119, 'activity' => 'Protect fruit development'],
            ['stage' => 'harvesting', 'day_start' => 120, 'day_end' => 139, 'activity' => 'Harvest the crop'],
        ];
    }

    private function assertValidSeason(?string $season): void
    {
        if ($season === null) {
            return;
        }

        if (! in_array($season, self::SEASONS, true)) {
            throw new DomainException(sprintf('Invalid season [%s]. Allowed seasons are: %s.', $season, implode(', ', self::SEASONS)));
        }
    }

    private function assertValidDates(?string $sowingDate, ?string $harvestDate): void
    {
        if ($sowingDate !== null && $harvestDate !== null) {
            try {
                $sowing = Carbon::parse($sowingDate);
                $harvest = Carbon::parse($harvestDate);
            } catch (\Throwable) {
                throw new DomainException('Sowing and harvest dates must be valid dates.');
            }

            if ($harvest->lt($sowing)) {
                throw new DomainException('Harvest date must not be earlier than the sowing date.');
            }
        }
    }

    private function assertFieldOwnership(int $userId, int $fieldId): void
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }
    }

    private function assertCropOwnership(int $userId, int $cropId): FarmerCrop
    {
        $crop = $this->farmerCrops->findById($cropId);

        if ($crop === null) {
            throw new DomainException(sprintf('Crop [%d] does not exist.', $cropId));
        }

        if ((int) $crop->user_id !== $userId) {
            throw new DomainException('You do not own this crop.');
        }

        return $crop;
    }

    private function assertNoOverlap(int $fieldId, ?int $exceptCropId, bool $isCurrent, bool $allowOverlap): void
    {
        if (! $isCurrent || $allowOverlap) {
            return;
        }

        $active = $this->farmerCrops->activeCropForField($fieldId);

        if ($active !== null && ($exceptCropId === null || (int) $active->id !== $exceptCropId)) {
            throw new DomainException(sprintf(
                'Field already has an active crop [%d]. Overlapping active crops are not allowed unless explicitly permitted.',
                (int) $active->id
            ));
        }
    }

    private function syncFieldCurrentCrop(int $fieldId, int $cropId): void
    {
        $this->fields->update($fieldId, ['current_crop_id' => $cropId]);
    }
}
