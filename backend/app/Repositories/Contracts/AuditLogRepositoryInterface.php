<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Collection;

interface AuditLogRepositoryInterface extends BaseRepositoryInterface
{

    public function recent(int $limit = 50): Collection;
}
