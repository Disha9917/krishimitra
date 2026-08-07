<?php

declare(strict_types=1);

namespace App\Services\Common;

use App\Models\ActivityLog;
use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ActivityLogService implements ActivityLogServiceInterface
{
    public function __construct(
        private readonly ActivityLogRepositoryInterface $activityLogs,
    ) {
    }

    public function record(
        int $userId,
        string $activityType,
        string $title,
        ?string $description = null,
        ?string $sourceRef = null,
    ): ActivityLog {
        return $this->activityLogs->create([
            'user_id' => $userId,
            'activity_type' => $activityType,
            'title' => $title,
            'description' => $description,
            'source_ref' => $sourceRef,
            'performed_at' => now(),
        ]);
    }

    public function recent(int $limit = 50): Collection
    {
        return $this->activityLogs->recent($limit);
    }

    public function logsForUser(int $userId, int $limit = 50): Collection
    {
        return $this->activityLogs->logsForUser($userId, $limit);
    }
}
