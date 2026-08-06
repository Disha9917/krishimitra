<?php

declare(strict_types=1);

namespace App\Services\Crop;

use App\Models\Crop;
use App\Models\CropRecommendation;
use App\Models\FarmerCrop;
use Illuminate\Database\Eloquent\Collection;

interface CropServiceInterface
{
    public function createCrop(array $data): Crop;

    public function updateCrop(int $cropId, array $data): ?Crop;

    public function activeCrops(): Collection;

    public function seasonalCrops(string $season): Collection;

    public function cropHistory(int $cropId, int $limit = 30): Collection;

    /**
     * Rank active crops for a season, preferring higher-value options.
     */
    public function recommendCrop(string $season, int $limit = 5): Collection;

    /**
     * Persist a crop recommendation snapshot for a farmer.
     */
    public function recordRecommendation(int $userId, array $inputSnapshot, array $recommendations): CropRecommendation;

    /**
     * Aggregate a farmer's harvests per crop (totals, averages, counts).
     *
     * @return \Illuminate\Support\Collection<string, array<string, mixed>>
     */
    public function harvestSummary(int $userId): \Illuminate\Support\Collection;

    /**
     * Register a planted crop for a farmer, enforcing ownership and overlap rules.
     *
     * @throws \DomainException when the field is not owned, dates are invalid,
     *                          or the field already has an active crop and overlap is not allowed
     */
    public function recordCrop(int $userId, array $data, bool $allowOverlap = false): FarmerCrop;

    /**
     * List every planted crop for a farmer.
     */
    public function cropsForUser(int $userId): Collection;

    /**
     * Fetch one of the farmer's crops, or null when missing or not owned.
     */
    public function getFarmerCrop(int $userId, int $cropId): ?FarmerCrop;

    /**
     * Update a planted crop, enforcing ownership.
     *
     * @throws \DomainException when the crop belongs to another user
     */
    public function updateFarmerCrop(int $userId, int $cropId, array $data): ?FarmerCrop;

    /**
     * Soft-delete a planted crop, enforcing ownership.
     *
     * @throws \DomainException when the crop belongs to another user
     */
    public function deleteFarmerCrop(int $userId, int $cropId): bool;

    /**
     * List the farmer's currently active crops.
     */
    public function activeCropsForUser(int $userId): Collection;

    /**
     * List the farmer's crops planted in a given season.
     */
    public function seasonalCropsForUser(int $userId, string $season): Collection;

    /**
     * Full crop history for a farmer, including soft-deleted crops.
     */
    public function cropHistoryForUser(int $userId): Collection;

    /**
     * Stage-by-stage lifecycle timeline for one of the farmer's crops.
     *
     * @return array<string, mixed>|null
     */
    public function farmerCropTimeline(int $userId, int $cropId): ?array;

    /**
     * Month-by-month calendar of the farmer's crops, advisory activities, and harvests.
     *
     * @return array<string, mixed>
     */
    public function farmerCropCalendar(int $userId, ?int $year = null): array;

    /**
     * Computed growth stage (with progress) for one of the farmer's crops.
     *
     * @return array<string, mixed>|null
     */
    public function farmerCropGrowthStage(int $userId, int $cropId): ?array;

    /**
     * Computed status for one of the farmer's crops.
     *
     * @return array<string, mixed>|null
     */
    public function farmerCropStatus(int $userId, int $cropId): ?array;

    /**
     * Dashboard-style summary of the farmer's crop portfolio.
     *
     * @return array<string, mixed>
     */
    public function dashboardCropSummary(int $userId): array;
}
