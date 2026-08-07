<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\NotificationSetting;

interface NotificationSettingRepositoryInterface extends BaseRepositoryInterface
{

    public function forUser(int $userId): ?NotificationSetting;
}
