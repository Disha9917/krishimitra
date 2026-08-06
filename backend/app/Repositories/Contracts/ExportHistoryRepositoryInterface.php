<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ExportHistory;
use Illuminate\Database\Eloquent\Collection;

interface ExportHistoryRepositoryInterface extends BaseRepositoryInterface
{

    public function historyForUser(int $userId): Collection;
}
