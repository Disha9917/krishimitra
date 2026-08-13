<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DiseaseHistory;
use App\Repositories\Contracts\DiseaseHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDiseaseHistoryRepository extends BaseEloquentRepository implements DiseaseHistoryRepositoryInterface
{
    public function __construct(DiseaseHistory $model)
    {
        parent::__construct($model);
    }

    public function historyForField(int $fieldId): Collection
    {
        return $this->model
            ->where('field_id', $fieldId)
            ->orderByDesc('id')
            ->get();
    }

    public function historyForFarmer(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->when(isset($filters['field_id']) && $filters['field_id'] !== null, function ($query) use ($filters): void {
                $query->where('field_id', (int) $filters['field_id']);
            })
            ->when(isset($filters['crop_id']) && $filters['crop_id'] !== null, function ($query) use ($filters): void {
                $query->where('crop_id', (int) $filters['crop_id']);
            })
            ->when(isset($filters['from']) && $filters['from'] !== null, function ($query) use ($filters): void {
                $query->whereHas('detection', function ($detection) use ($filters): void {
                    $detection->where('detected_at', '>=', $filters['from']);
                });
            })
            ->when(isset($filters['to']) && $filters['to'] !== null, function ($query) use ($filters): void {
                $query->whereHas('detection', function ($detection) use ($filters): void {
                    $detection->where('detected_at', '<=', $filters['to']);
                });
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function findForFarmer(int $userId, int $historyId): ?DiseaseHistory
    {
        return $this->model
            ->where('id', $historyId)
            ->where('user_id', $userId)
            ->first();
    }
}
