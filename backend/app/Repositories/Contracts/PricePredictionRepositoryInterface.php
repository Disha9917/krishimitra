<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\PricePrediction;
use Illuminate\Database\Eloquent\Collection;

interface PricePredictionRepositoryInterface extends BaseRepositoryInterface
{

    public function predictionsForCrop(int $cropId): Collection;

    public function latestPredictions(int $limit = 20): Collection;
}
