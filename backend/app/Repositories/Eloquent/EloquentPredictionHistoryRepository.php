<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\PredictionHistory;
use App\Repositories\Contracts\PredictionHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentPredictionHistoryRepository extends BaseEloquentRepository implements PredictionHistoryRepositoryInterface
{
    public function __construct(PredictionHistory $model)
    {
        parent::__construct($model);
    }

    public function historyForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('occurred_at')
                ->get();
    }

    public function recent(int $limit = 20): Collection
    {
            return $this->model
                ->orderByDesc('occurred_at')
                ->limit($limit)
                ->get();
    }
}
