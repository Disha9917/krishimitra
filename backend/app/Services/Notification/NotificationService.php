<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\NotificationSettingRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class NotificationService implements NotificationServiceInterface
{
    private const OPT_OUT_FLAGS = [
        'PRICE' => 'price_threshold_alerts',
        'DISEASE' => 'disease_alerts',
        'WEATHER' => 'weather_alerts',
    ];

    public function __construct(
        private readonly NotificationRepositoryInterface $notifications,
        private readonly NotificationSettingRepositoryInterface $settings,
    ) {
    }

    public function sendNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?string $sourceRef = null,
    ): ?Notification {
        $settings = $this->settings->forUser($userId);

        $flag = self::OPT_OUT_FLAGS[$type] ?? null;

        if ($flag !== null && $settings !== null && !(bool) $settings->{$flag}) {
            return null;
        }

        return $this->notifications->create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'source_ref' => $sourceRef,
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function sendBulk(array $recipientIds, string $type, string $title, string $message, ?string $actionUrl = null): int
    {
        if ($recipientIds === []) {
            return 0;
        }

        $rows = array_map(
            static fn (int $userId): array => [
                'user_id' => $userId,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'action_url' => $actionUrl,
                'source_ref' => null,
                'is_read' => false,
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            $recipientIds
        );

        return $this->notifications->bulkInsert($rows) ? count($rows) : 0;
    }

    public function unreadNotifications(int $userId): Collection
    {
        return $this->notifications->unreadForUser($userId);
    }

    public function unreadCount(int $userId): int
    {
        return $this->notifications->unreadCount($userId);
    }

    public function markAsRead(int $userId, int $notificationId): bool
    {
        $notification = $this->notifications->findById($notificationId);

        if ($notification === null) {
            throw new DomainException(sprintf('Notification [%d] does not exist.', $notificationId));
        }

        if ((int) $notification->user_id !== $userId) {
            throw new DomainException('You do not own this notification.');
        }

        return $this->notifications->update($notificationId, [
            'is_read' => true,
            'read_at' => now(),
        ]) !== null;
    }

    public function markAllRead(int $userId): int
    {
        return $this->notifications->markAllRead($userId);
    }
}
