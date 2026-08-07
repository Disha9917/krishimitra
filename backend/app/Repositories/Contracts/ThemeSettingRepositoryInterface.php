<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ThemeSetting;

interface ThemeSettingRepositoryInterface extends BaseRepositoryInterface
{

    public function forUser(int $userId): ?ThemeSetting;
}
