<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\UserSetting;
use App\Repositories\Contracts\UserSettingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentUserSettingRepository extends BaseEloquentRepository implements UserSettingRepositoryInterface
{
    public function __construct(UserSetting $model)
    {
        parent::__construct($model);
    }

    public function settingsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->get();
    }
}
