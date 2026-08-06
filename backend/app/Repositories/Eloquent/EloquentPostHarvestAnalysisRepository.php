<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\PostHarvestAnalysis;
use App\Repositories\Contracts\PostHarvestAnalysisRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentPostHarvestAnalysisRepository extends BaseEloquentRepository implements PostHarvestAnalysisRepositoryInterface
{
    public function __construct(PostHarvestAnalysis $model)
    {
        parent::__construct($model);
    }

    public function analysesForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
