<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\PricePrediction;
use App\Repositories\Contracts\PricePredictionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentPricePredictionRepository extends BaseEloquentRepository implements PricePredictionRepositoryInterface
{
    public function __construct(PricePrediction $model)
    {
        parent::__construct($model);
    }

    public function predictionsForCrop(int $cropId): Collection
    {
            return $this->model
                ->where('crop_id', $cropId)
                ->orderByDesc('generated_at')
                ->get();
    }

    public function latestPredictions(int $limit = 20): Collection
    {
            return $this->model
                ->orderByDesc('generated_at')
                ->limit($limit)
                ->get();
    }
}
