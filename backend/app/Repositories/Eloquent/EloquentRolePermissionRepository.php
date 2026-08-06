<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\RolePermission;
use App\Repositories\Contracts\RolePermissionRepositoryInterface;

class EloquentRolePermissionRepository extends BaseEloquentRepository implements RolePermissionRepositoryInterface
{
    public function __construct(RolePermission $model)
    {
        parent::__construct($model);
    }
}
