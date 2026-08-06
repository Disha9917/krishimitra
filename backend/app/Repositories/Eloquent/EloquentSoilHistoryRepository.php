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
}
