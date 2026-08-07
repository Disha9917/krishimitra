<?php

declare(strict_types=1);

namespace App\Services\Common;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;

interface ActivityLogServiceInterface
{
    /**
     * Record an activity entry with an audit timestamp.
     */
    public function record(
        int $userId,
        string $activityType,
        string $title,
        ?string $description = null,
        ?string $sourceRef = null,
    ): ActivityLog;

    public function recent(int $limit = 50): Collection;

    public function logsForUser(int $userId, int $limit = 50): Collection;
}
