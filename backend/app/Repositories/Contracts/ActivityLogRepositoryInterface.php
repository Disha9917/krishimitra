<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

interface ActivityLogRepositoryInterface extends BaseRepositoryInterface
{

    public function recent(int $limit = 50): Collection;

    public function logsForUser(int $userId, int $limit = 50): Collection;
}
