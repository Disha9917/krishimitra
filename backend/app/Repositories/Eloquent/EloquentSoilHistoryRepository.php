<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SoilHistory;
use App\Repositories\Contracts\SoilHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentSoilHistoryRepository extends BaseEloquentRepository implements SoilHistoryRepositoryInterface
{
    public function __construct(SoilHistory $model)
    {
        parent::__construct($model);
    }

    public function historyForField(int $fieldId): Collection
    {
        return $this->model
            ->where('field_id', $fieldId)
            ->orderByDesc('sampled_on')
            ->get();
    }

    public function historyForFarmer(int $userId, array $filters = [], int $limit = 20): Collection
    {
        $query = $this->model
            ->with(['field', 'soilTest.crop'])
            ->whereHas('field', fn ($field) => $field->where('user_id', $userId));

        if (! empty($filters['field_id'])) {
            $query->where('field_id', (int) $filters['field_id']);
        }

        if (! empty($filters['crop_id'])) {
            $query->whereHas('soilTest', fn ($test) => $test->where('crop_id', (int) $filters['crop_id']));
        }

        if (! empty($filters['from'])) {
            $query->whereDate('sampled_on', '>=', (string) $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->whereDate('sampled_on', '<=', (string) $filters['to']);
        }

        return $query
            ->orderByDesc('sampled_on')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }
}
