<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Disease;
use App\Repositories\Contracts\DiseaseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentDiseaseRepository extends BaseEloquentRepository implements DiseaseRepositoryInterface
{
    public function __construct(Disease $model)
    {
        parent::__construct($model);
    }

    public function recentDetections(int $limit = 10): Collection
    {
            return $this->model
                ->whereHas('diseaseDetections', function (Builder $query): void {
                    $query->where('detected_at', '>=', now()->subDays(30));
                })
                ->withCount(['diseaseDetections' => function (Builder $query): void {
                    $query->where('detected_at', '>=', now()->subDays(30));
                }])
                ->orderByDesc('disease_detections_count')
                ->limit($limit)
                ->get();
    }

    public function diseaseHistory(?int $cropId = null, int $limit = 30): Collection
    {
            return $this->model
                ->newQuery()
                ->when($cropId !== null, function (Builder $query) use ($cropId): void {
                    $query->where('crop_id', $cropId);
                })
                ->has('diseaseHistories')
                ->withCount('diseaseHistories')
                ->orderByDesc('disease_histories_count')
                ->limit($limit)
                ->get();
    }
}
