<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\UserRole;
use App\Repositories\Contracts\UserRoleRepositoryInterface;

class EloquentUserRoleRepository extends BaseEloquentRepository implements UserRoleRepositoryInterface
{
    public function __construct(UserRole $model)
    {
        parent::__construct($model);
    }
}
