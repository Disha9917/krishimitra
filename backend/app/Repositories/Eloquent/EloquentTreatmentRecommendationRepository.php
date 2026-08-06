<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TreatmentRecommendation;
use App\Repositories\Contracts\TreatmentRecommendationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTreatmentRecommendationRepository extends BaseEloquentRepository implements TreatmentRecommendationRepositoryInterface
{
    public function __construct(TreatmentRecommendation $model)
    {
        parent::__construct($model);
    }

    public function recommendationsForDisease(int $diseaseId): Collection
    {
            return $this->model
                ->where('disease_id', $diseaseId)
                ->where('is_active', true)
                ->get();
    }
}
