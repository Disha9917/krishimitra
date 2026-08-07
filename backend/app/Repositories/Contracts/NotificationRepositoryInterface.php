<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

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
}
