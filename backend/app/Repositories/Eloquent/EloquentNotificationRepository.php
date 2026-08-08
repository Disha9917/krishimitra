<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    public function paginatedForUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model
            ->where('user_id', $userId)
            ->orderByDesc('id');

        if (isset($filters['type']) && $filters['type'] !== null) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['is_read']) && $filters['is_read'] !== null) {
            $query->where('is_read', (bool) $filters['is_read']);
        }

        return $query->paginate($perPage);
    }

    public function historyForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function softDeleteForUser(int $userId, int $notificationId): bool
    {
        $notification = $this->findById($notificationId);

        if ($notification === null || (int) $notification->user_id !== $userId) {
            return false;
        }

        return $notification->delete() !== false;
    }

    public function unreadCountByType(int $userId): array
    {
        $rows = $this->model
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->selectRaw('type, count(*) as cnt')
            ->groupBy('type')
            ->get()
            ->pluck('cnt', 'type')
            ->toArray();

        return $rows;
    }
}
