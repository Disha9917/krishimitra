<?php

declare(strict_types=1);

namespace App\Services\Common;

use App\Models\LanguageSetting;
use App\Models\NotificationSetting;
use App\Models\ThemeSetting;
use App\Models\UserSetting;

interface SettingsServiceInterface
{
    public function language(int $userId): ?LanguageSetting;

    /**
     * Persist the preferred language and record the change timestamp.
     */
    public function setLanguage(int $userId, string $language): LanguageSetting;

    public function theme(int $userId): ?ThemeSetting;

    public function setTheme(int $userId, string $theme): ThemeSetting;

    public function notificationSettings(int $userId): ?NotificationSetting;

    /**
     * Upsert alert preferences for a user.
     */
    public function updateNotificationSettings(int $userId, array $data): NotificationSetting;

    public function getSetting(int $userId, string $key): ?UserSetting;

    /**
     * Upsert a key/value user setting (value stored as JSON).
     */
    public function setSetting(int $userId, string $key, mixed $value): UserSetting;
}
