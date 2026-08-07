<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\UserSetting;
use Illuminate\Database\Eloquent\Collection;

interface UserSettingRepositoryInterface extends BaseRepositoryInterface
{

    public function settingsForUser(int $userId): Collection;
}
