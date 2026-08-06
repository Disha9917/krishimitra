<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Report;
use Illuminate\Database\Eloquent\Collection;

interface ReportRepositoryInterface extends BaseRepositoryInterface
{

    public function reportsForUser(int $userId): Collection;
}
