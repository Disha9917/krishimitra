<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\NotificationPreference;
use App\Repositories\Contracts\NotificationPreferenceRepositoryInterface;

class EloquentNotificationPreferenceRepository extends BaseEloquentRepository implements NotificationPreferenceRepositoryInterface
{
    public function __construct(NotificationPreference $model)
    {
        parent::__construct($model);
    }

    public function forUser(int $userId): ?NotificationPreference
    {
        return $this->model
            ->where('user_id', $userId)
            ->first();
    }

    public function createForUser(int $userId, array $attributes): NotificationPreference
    {
        return $this->model->create(array_merge(
            ['user_id' => $userId],
            $attributes,
        ));
    }

    public function updateForUser(int $userId, array $attributes): ?NotificationPreference
    {
        $preference = $this->forUser($userId);

        if ($preference === null) {
            return $this->createForUser($userId, $attributes);
        }

        $preference->update($attributes);

        return $preference->refresh();
    }

    public function isTypeEnabled(int $userId, string $type): bool
    {
        $preference = $this->forUser($userId);

        if ($preference === null) {
            return true;
        }

        $column = self::preferenceColumn($type);

        return $column !== null ? (bool) $preference->{$column} : true;
    }

    private static function preferenceColumn(string $type): ?string
    {
        return match ($type) {
            'WEATHER', 'WEATHER_ALERT' => 'weather_alerts',
            'DISEASE', 'DISEASE_ALERT' => 'disease_alerts',
            'PRICE', 'MARKET_ALERT' => 'market_alerts',
            'GOVERNMENT_SCHEME' => 'government_scheme_alerts',
            'EQUIPMENT_BOOKING' => 'equipment_alerts',
            'COLD_STORAGE_BOOKING' => 'cold_storage_alerts',
            'TRANSPORT_BOOKING' => 'transport_alerts',
            'AI_ADVISORY', 'ADVISORY' => 'ai_advisory_alerts',
            'SYSTEM' => 'system_alerts',
            default => null,
        };
    }
}
