<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\CropRecommendation;
use App\Repositories\Contracts\CropRecommendationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCropRecommendationRepository extends BaseEloquentRepository implements CropRecommendationRepositoryInterface
{
    public function __construct(CropRecommendation $model)
    {
        parent::__construct($model);
    }

    public function recommendationsForFarmer(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
