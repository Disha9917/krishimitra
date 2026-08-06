<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\PredictionHistory;
use Illuminate\Database\Eloquent\Collection;

interface PredictionHistoryRepositoryInterface extends BaseRepositoryInterface
{

    public function historyForUser(int $userId): Collection;

    /**
     * Most recent predictions ordered by occurrence.
     */
    public function recent(int $limit = 20): Collection;
}
