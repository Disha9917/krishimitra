<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\LanguageSetting;

interface LanguageSettingRepositoryInterface extends BaseRepositoryInterface
{

    public function forUser(int $userId): ?LanguageSetting;
}
