<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\LanguageSetting;
use App\Repositories\Contracts\LanguageSettingRepositoryInterface;

class EloquentLanguageSettingRepository extends BaseEloquentRepository implements LanguageSettingRepositoryInterface
{
    public function __construct(LanguageSetting $model)
    {
        parent::__construct($model);
    }

    public function forUser(int $userId): ?LanguageSetting
    {
            return $this->model
                ->where('user_id', $userId)
                ->first();
    }
}
