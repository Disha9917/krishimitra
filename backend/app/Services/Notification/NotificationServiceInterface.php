<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use App\Models\NotificationPreference;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    /**
     * Paginated notifications for a user with optional type/read filters.
     */
    public function listNotifications(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Paginated notification history (all notifications).
     */
    public function notificationHistory(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Find a single notification by ID, enforcing ownership.
     *
     * @throws \DomainException when the notification belongs to another user
     */
    public function findNotification(int $userId, int $notificationId): Notification;

    /**
     * Soft-delete a notification, enforcing ownership.
     *
     * @throws \DomainException when the notification belongs to another user
     */
    public function deleteNotification(int $userId, int $notificationId): bool;

    /**
     * Get the user's notification preferences.
     */
    public function getPreferences(int $userId): NotificationPreference;

    /**
     * Update the user's notification preferences.
     */
    public function updatePreferences(int $userId, array $data): NotificationPreference;

    /**
     * Unread count breakdown by type.
     */
    public function unreadCountByType(int $userId): array;

    /**
     * Check if a given notification type is enabled for a user.
     */
    public function isTypeEnabled(int $userId, string $type): bool;
}
