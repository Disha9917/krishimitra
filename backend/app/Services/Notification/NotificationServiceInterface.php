<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

interface NotificationServiceInterface
{
    /**
     * Create a notification for a user, respecting their alert preferences.
     * Returns null when the alert type is disabled by the user's settings.
     */
    public function sendNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?string $sourceRef = null,
    ): ?Notification;

    /**
     * Fan-out the same notification to many recipients in a single insert.
     */
    public function sendBulk(array $recipientIds, string $type, string $title, string $message, ?string $actionUrl = null): int;

    public function unreadNotifications(int $userId): Collection;

    public function unreadCount(int $userId): int;

    /**
     * Mark a single notification read, enforcing ownership.
     *
     * @throws \DomainException when the notification belongs to another user
     */
    public function markAsRead(int $userId, int $notificationId): bool;

    public function markAllRead(int $userId): int;
}
