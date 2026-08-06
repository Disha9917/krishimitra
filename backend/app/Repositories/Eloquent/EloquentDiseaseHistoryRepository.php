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
}
