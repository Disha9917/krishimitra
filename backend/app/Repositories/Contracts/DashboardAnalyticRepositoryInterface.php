<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DashboardAnalytic;
use Illuminate\Database\Eloquent\Collection;

interface DashboardAnalyticRepositoryInterface extends BaseRepositoryInterface
{

    public function analyticsForUser(int $userId): Collection;
}
