<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DiseaseDetection;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDiseaseDetectionRepository extends BaseEloquentRepository implements DiseaseDetectionRepositoryInterface
{
    public function __construct(DiseaseDetection $model)
    {
        parent::__construct($model);
    }

    public function detectionsForFarmer(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('detected_at')
                ->get();
    }
}
