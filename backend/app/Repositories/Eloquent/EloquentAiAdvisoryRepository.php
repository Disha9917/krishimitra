<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\AiAdvisory;
use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentAiAdvisoryRepository extends BaseEloquentRepository implements AiAdvisoryRepositoryInterface
{
    public function __construct(AiAdvisory $model)
    {
        parent::__construct($model);
    }

    public function advisoriesForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->get();
    }

    public function historyForUser(int $userId, ?string $advisoryType, int $limit): Collection
    {
        $query = $this->model->where('user_id', $userId);

        if ($advisoryType !== null && $advisoryType !== '') {
            $query->where('advisory_type', $advisoryType);
        }

        return $query
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }
}
