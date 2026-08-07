<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\AuditLog;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentAuditLogRepository extends BaseEloquentRepository implements AuditLogRepositoryInterface
{
    public function __construct(AuditLog $model)
    {
        parent::__construct($model);
    }

    public function recent(int $limit = 50): Collection
    {
            return $this->model
                ->orderByDesc('performed_at')
                ->limit($limit)
                ->get();
    }
}
