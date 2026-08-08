<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface NotificationRepositoryInterface extends BaseRepositoryInterface
{
    public function unreadForUser(int $userId): Collection;

    public function unreadCount(int $userId): int;

    public function markAllRead(int $userId): int;

    /**
     * Notifications of a given type for a user, newest first.
     */
    public function forUserByType(int $userId, string $type): Collection;

    /**
     * Paginated notifications for a user with optional filters.
     */
    public function paginatedForUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Paginated read notifications for a user (history).
     */
    public function historyForUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Delete (soft) a notification enforcing ownership.
     */
    public function softDeleteForUser(int $userId, int $notificationId): bool;

    /**
     * Count unread notifications per type for a user.
     */
    public function unreadCountByType(int $userId): array;
}
