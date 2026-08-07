<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ThemeSetting;
use App\Repositories\Contracts\ThemeSettingRepositoryInterface;

class EloquentThemeSettingRepository extends BaseEloquentRepository implements ThemeSettingRepositoryInterface
{
    public function __construct(ThemeSetting $model)
    {
        parent::__construct($model);
    }

    public function forUser(int $userId): ?ThemeSetting
    {
            return $this->model
                ->where('user_id', $userId)
                ->first();
    }
}
