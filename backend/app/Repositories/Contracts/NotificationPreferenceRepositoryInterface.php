<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\NotificationPreference;

interface NotificationPreferenceRepositoryInterface extends BaseRepositoryInterface
{
    public function forUser(int $userId): ?NotificationPreference;

    public function createForUser(int $userId, array $attributes): NotificationPreference;

    public function updateForUser(int $userId, array $attributes): ?NotificationPreference;

    public function isTypeEnabled(int $userId, string $type): bool;
}
