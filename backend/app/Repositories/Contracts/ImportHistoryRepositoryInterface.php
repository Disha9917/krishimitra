<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ImportHistory;
use Illuminate\Database\Eloquent\Collection;

interface ImportHistoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Fetch import history rows, optionally filtered by dataset and status.
     *
     * @return Collection<int, ImportHistory>
     */
    public function historyForDataset(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection;

    /**
     * Set the status (and any extra attributes) of an import.
     */
    public function markStatus(int $id, string $status, array $extra = []): ?ImportHistory;

    /**
     * Accumulate the per-action row counts of an import.
     */
    public function updateCounts(int $id, int $inserted, int $updated, int $skipped, int $failed): ?ImportHistory;
}
