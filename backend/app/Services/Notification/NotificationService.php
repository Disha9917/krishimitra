<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Repositories\Contracts\NotificationPreferenceRepositoryInterface;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\NotificationSettingRepositoryInterface;
use DomainException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NotificationService implements NotificationServiceInterface
{
    private const OPT_OUT_FLAGS = [
        'PRICE' => 'price_threshold_alerts',
        'DISEASE' => 'disease_alerts',
        'WEATHER' => 'weather_alerts',
    ];

    /** Map legacy types to enterprise preference columns. */
    private const TYPE_TO_PREFERENCE = [
        'PRICE' => 'market_alerts',
        'MARKET_ALERT' => 'market_alerts',
        'DISEASE' => 'disease_alerts',
        'DISEASE_ALERT' => 'disease_alerts',
        'WEATHER' => 'weather_alerts',
        'WEATHER_ALERT' => 'weather_alerts',
        'GOVERNMENT_SCHEME' => 'government_scheme_alerts',
        'EQUIPMENT_BOOKING' => 'equipment_alerts',
        'COLD_STORAGE_BOOKING' => 'cold_storage_alerts',
        'TRANSPORT_BOOKING' => 'transport_alerts',
        'AI_ADVISORY' => 'ai_advisory_alerts',
        'ADVISORY' => 'ai_advisory_alerts',
        'SYSTEM' => 'system_alerts',
    ];

    public function __construct(
        private readonly NotificationRepositoryInterface $notifications,
        private readonly NotificationSettingRepositoryInterface $settings,
        private readonly NotificationPreferenceRepositoryInterface $preferences,
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
        if (!$this->isTypeEnabled($userId, $type)) {
            return null;
        }

        $legacyFlag = self::OPT_OUT_FLAGS[$type] ?? null;
        if ($legacyFlag !== null) {
            $settings = $this->settings->forUser($userId);
            if ($settings !== null && !(bool) $settings->{$legacyFlag}) {
                return null;
            }
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

        $eligible = array_filter(
            $recipientIds,
            fn (int $userId): bool => $this->isTypeEnabled($userId, $type),
        );

        if ($eligible === []) {
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
            $eligible,
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

    public function listNotifications(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->notifications->paginatedForUser($userId, $filters, $perPage);
    }

    public function notificationHistory(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->notifications->historyForUser($userId, $perPage);
    }

    public function findNotification(int $userId, int $notificationId): Notification
    {
        $notification = $this->notifications->findById($notificationId);

        if ($notification === null) {
            throw new DomainException(sprintf('Notification [%d] does not exist.', $notificationId));
        }

        if ((int) $notification->user_id !== $userId) {
            throw new DomainException('You do not own this notification.');
        }

        return $notification;
    }

    public function deleteNotification(int $userId, int $notificationId): bool
    {
        $notification = $this->notifications->findById($notificationId);

        if ($notification === null) {
            throw new DomainException(sprintf('Notification [%d] does not exist.', $notificationId));
        }

        if ((int) $notification->user_id !== $userId) {
            throw new DomainException('You do not own this notification.');
        }

        return $this->notifications->delete($notificationId);
    }

    public function getPreferences(int $userId): NotificationPreference
    {
        $existing = $this->preferences->forUser($userId);

        if ($existing !== null) {
            return $existing;
        }

        return $this->preferences->createForUser($userId, [
            'weather_alerts' => true,
            'disease_alerts' => true,
            'market_alerts' => true,
            'government_scheme_alerts' => true,
            'equipment_alerts' => true,
            'cold_storage_alerts' => true,
            'transport_alerts' => true,
            'ai_advisory_alerts' => true,
            'system_alerts' => true,
            'email_enabled' => false,
        ]);
    }

    public function updatePreferences(int $userId, array $data): NotificationPreference
    {
        return $this->preferences->updateForUser($userId, $data);
    }

    public function unreadCountByType(int $userId): array
    {
        return $this->notifications->unreadCountByType($userId);
    }

    public function isTypeEnabled(int $userId, string $type): bool
    {
        return $this->preferences->isTypeEnabled($userId, $type);
    }
}
