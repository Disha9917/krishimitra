<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Permission;
use App\Repositories\Contracts\PermissionRepositoryInterface;

class EloquentPermissionRepository extends BaseEloquentRepository implements PermissionRepositoryInterface
{
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }
}
