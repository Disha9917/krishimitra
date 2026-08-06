<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Collection;

interface FeedbackRepositoryInterface extends BaseRepositoryInterface
{

    public function recentFeedback(int $limit = 20): Collection;

    public function feedbackForUser(int $userId): Collection;
}
