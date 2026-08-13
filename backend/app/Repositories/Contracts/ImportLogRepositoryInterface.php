<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ImportLog;
use Illuminate\Database\Eloquent\Collection;

interface ImportLogRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Fetch every row-level log entry for an import.
     *
     * @return Collection<int, ImportLog>
     */
    public function logsForImport(int $importId): Collection;

    /**
     * Fetch log entries for an import restricted to the given actions.
     *
     * @param  list<string>  $actions
     * @return Collection<int, ImportLog>
     */
    public function logsForImportByAction(int $importId, array $actions): Collection;
}
