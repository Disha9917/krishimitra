<?php

declare(strict_types=1);

namespace App\Services\Common\DTO;

use App\Models\Notification;

/** Immutable representation of a notification for API responses. */
final readonly class NotificationDTO
{
    public function __construct(
        public int $id,
        public string $uuid,
        public int $userId,
        public string $type,
        public string $title,
        public string $message,
        public ?string $actionUrl = null,
        public ?string $sourceRef = null,
        public bool $isRead = false,
        public ?string $readAt = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}

    public static function fromModel(Notification $notification): self
    {
        return new self(
            id: (int) $notification->id,
            uuid: (string) $notification->uuid,
            userId: (int) $notification->user_id,
            type: (string) $notification->type,
            title: (string) $notification->title,
            message: (string) $notification->message,
            actionUrl: $notification->action_url,
            sourceRef: $notification->source_ref,
            isRead: (bool) $notification->is_read,
            readAt: $notification->read_at?->toIso8601String(),
            createdAt: $notification->created_at?->toIso8601String(),
            updatedAt: $notification->updated_at?->toIso8601String(),
        );
    }

    /** Map legacy type codes to enterprise categories. */
    public static function normalizeType(string $type): string
    {
        return match ($type) {
            'PRICE' => 'MARKET_ALERT',
            'DISEASE' => 'DISEASE_ALERT',
            'WEATHER' => 'WEATHER_ALERT',
            'ADVISORY' => 'AI_ADVISORY',
            default => $type,
        };
    }
}
