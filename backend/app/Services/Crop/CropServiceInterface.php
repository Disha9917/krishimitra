<?php

declare(strict_types=1);

namespace App\Services\Crop;

use App\Models\Crop;
use App\Models\CropRecommendation;
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
     * @return Collection<string, array<string, mixed>>
     */
    public function harvestSummary(int $userId): Collection;
}
