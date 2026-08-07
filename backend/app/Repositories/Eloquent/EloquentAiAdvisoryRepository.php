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
}
