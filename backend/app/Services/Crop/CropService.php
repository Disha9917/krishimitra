<?php

declare(strict_types=1);

namespace App\Services\Crop;

use App\Models\Crop;
use App\Models\CropRecommendation;
use App\Repositories\Contracts\CropRecommendationRepositoryInterface;
use App\Repositories\Contracts\CropRepositoryInterface;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CropService implements CropServiceInterface
{
    public function __construct(
        private readonly CropRepositoryInterface $crops,
        private readonly CropRecommendationRepositoryInterface $recommendations,
        private readonly HarvestRepositoryInterface $harvests,
    ) {
    }

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

    public function harvestSummary(int $userId): Collection
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
}
