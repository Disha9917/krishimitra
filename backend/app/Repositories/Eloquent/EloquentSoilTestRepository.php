<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SoilTest;
use App\Repositories\Contracts\SoilTestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentSoilTestRepository extends BaseEloquentRepository implements SoilTestRepositoryInterface
{
    public function __construct(SoilTest $model)
    {
        parent::__construct($model);
    }

    public function latestForFarmer(int $userId, int $limit = 5): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('report_date')
            ->limit($limit)
            ->get();
    }

    public function listForFarmer(int $userId, array $filters = [], int $limit = 20): Collection
    {
        $query = $this->model
            ->with(['field', 'crop', 'soilType'])
            ->where('user_id', $userId);

        if (! empty($filters['field_id'])) {
            $query->where('field_id', (int) $filters['field_id']);
        }

        if (! empty($filters['crop_id'])) {
            $query->where('crop_id', (int) $filters['crop_id']);
        }

        if (! empty($filters['from'])) {
            $query->whereDate('report_date', '>=', (string) $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->whereDate('report_date', '<=', (string) $filters['to']);
        }

        return $query
            ->orderByDesc('report_date')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function findForFarmer(int $userId, int $testId): ?SoilTest
    {
        return $this->model
            ->with(['field', 'crop', 'soilType'])
            ->where('user_id', $userId)
            ->find($testId);
    }
}
