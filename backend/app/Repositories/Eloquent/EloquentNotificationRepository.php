<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentNotificationRepository extends BaseEloquentRepository implements NotificationRepositoryInterface
{
    public function __construct(Notification $model)
    {
        parent::__construct($model);
    }

    public function unreadForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->orderByDesc('id')
            ->get();
    }

    public function unreadCount(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    public function markAllRead(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);
    }

    public function forUserByType(int $userId, string $type): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('type', $type)
            ->orderByDesc('id')
            ->get();
    }
}
