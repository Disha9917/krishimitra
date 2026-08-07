<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\NotificationSetting;
use App\Repositories\Contracts\NotificationSettingRepositoryInterface;

class EloquentNotificationSettingRepository extends BaseEloquentRepository implements NotificationSettingRepositoryInterface
{
    public function __construct(NotificationSetting $model)
    {
        parent::__construct($model);
    }

    public function forUser(int $userId): ?NotificationSetting
    {
            return $this->model
                ->where('user_id', $userId)
                ->first();
    }
}
