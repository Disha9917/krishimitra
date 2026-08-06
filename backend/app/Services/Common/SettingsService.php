<?php

declare(strict_types=1);

namespace App\Services\Common;

use App\Models\LanguageSetting;
use App\Models\NotificationSetting;
use App\Models\ThemeSetting;
use App\Models\UserSetting;
use App\Repositories\Contracts\LanguageSettingRepositoryInterface;
use App\Repositories\Contracts\NotificationSettingRepositoryInterface;
use App\Repositories\Contracts\ThemeSettingRepositoryInterface;
use App\Repositories\Contracts\UserSettingRepositoryInterface;

class SettingsService implements SettingsServiceInterface
{
    public function __construct(
        private readonly LanguageSettingRepositoryInterface $languages,
        private readonly ThemeSettingRepositoryInterface $themes,
        private readonly NotificationSettingRepositoryInterface $notificationSettings,
        private readonly UserSettingRepositoryInterface $userSettings,
    ) {
    }

    public function language(int $userId): ?LanguageSetting
    {
        return $this->languages->forUser($userId);
    }

    public function setLanguage(int $userId, string $language): LanguageSetting
    {
        $existing = $this->languages->forUser($userId);

        if ($existing === null) {
            return $this->languages->create([
                'user_id' => $userId,
                'language' => $language,
                'changed_at' => now(),
            ]);
        }

        return $this->languages->update((int) $existing->id, [
            'language' => $language,
            'changed_at' => now(),
        ]) ?? $existing;
    }

    public function theme(int $userId): ?ThemeSetting
    {
        return $this->themes->forUser($userId);
    }

    public function setTheme(int $userId, string $theme): ThemeSetting
    {
        $existing = $this->themes->forUser($userId);

        if ($existing === null) {
            return $this->themes->create([
                'user_id' => $userId,
                'theme' => $theme,
            ]);
        }

        return $this->themes->update((int) $existing->id, [
            'theme' => $theme,
        ]) ?? $existing;
    }

    public function notificationSettings(int $userId): ?NotificationSetting
    {
        return $this->notificationSettings->forUser($userId);
    }

    public function updateNotificationSettings(int $userId, array $data): NotificationSetting
    {
        $allowed = [
            'sms_enabled',
            'whatsapp_enabled',
            'price_threshold_alerts',
            'disease_alerts',
            'weather_alerts',
            'min_price_threshold_inr',
        ];

        $attributes = array_intersect_key($data, array_flip($allowed));

        $existing = $this->notificationSettings->forUser($userId);

        if ($existing === null) {
            return $this->notificationSettings->create([
                'user_id' => $userId,
                ...$attributes,
            ]);
        }

        return $this->notificationSettings->update((int) $existing->id, $attributes) ?? $existing;
    }

    public function getSetting(int $userId, string $key): ?UserSetting
    {
        return $this->userSettings->findFirstWhere([
            'user_id' => $userId,
            'key' => $key,
        ]);
    }

    public function setSetting(int $userId, string $key, mixed $value): UserSetting
    {
        $existing = $this->getSetting($userId, $key);

        if ($existing === null) {
            return $this->userSettings->create([
                'user_id' => $userId,
                'key' => $key,
                'value_json' => $value,
            ]);
        }

        return $this->userSettings->update((int) $existing->id, [
            'value_json' => $value,
        ]) ?? $existing;
    }
}
