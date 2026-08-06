<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Feedback;
use App\Repositories\Contracts\FeedbackRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFeedbackRepository extends BaseEloquentRepository implements FeedbackRepositoryInterface
{
    public function __construct(Feedback $model)
    {
        parent::__construct($model);
    }

    public function recentFeedback(int $limit = 20): Collection
    {
            return $this->model
                ->orderByDesc('id')
                ->limit($limit)
                ->get();
    }

    public function feedbackForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
