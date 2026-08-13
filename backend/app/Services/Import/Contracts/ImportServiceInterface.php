<?php

declare(strict_types=1);

namespace App\Services\Import\Contracts;

use App\Models\ImportHistory;
use App\Models\ImportLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;

interface ImportServiceInterface
{
    /**
     * Resolve the driver registered for a dataset slug.
     *
     * @throws InvalidArgumentException
     */
    public function driver(string $datasetType): ImportDatasetDriverInterface;

    /**
     * Parse and validate an uploaded CSV without writing anything.
     *
     * @return array<string, mixed> validation report payload
     */
    public function validateFile(UploadedFile $file, string $datasetType): array;

    /**
     * Validate and return the first sample of valid rows.
     *
     * @return array<string, mixed> validation report payload with preview
     */
    public function preview(UploadedFile $file, string $datasetType): array;

    /**
     * Start an import: stores the file, creates the history record and runs
     * synchronously (small files) or queues the work (large files).
     */
    public function import(int $userId, UploadedFile $file, string $datasetType): ImportHistory;

    /**
     * Process an import end-to-end in chunked transactions.
     */
    public function processImport(int $importId): void;

    /**
     * Reverse a completed import: delete inserted rows and restore the
     * before-images of updated rows. Previous imports stay untouched.
     *
     * @throws \DomainException when the import is not in a reversible state
     */
    public function rollback(int $importId): ?ImportHistory;

    /**
     * @return Collection<int, ImportHistory>
     */
    public function history(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection;

    public function find(int $importId): ?ImportHistory;

    /**
     * @return Collection<int, ImportLog>
     */
    public function logs(int $importId): Collection;
}
