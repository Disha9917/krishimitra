<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\CropRecommendation;
use Illuminate\Database\Eloquent\Collection;

interface CropRecommendationRepositoryInterface extends BaseRepositoryInterface
{

    public function recommendationsForFarmer(int $userId): Collection;
}
