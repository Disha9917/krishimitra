<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\Import\Contracts\ImportServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Processes a large CSV import in the background; small imports run inline
 * via ImportService and never reach the queue.
 */
class ImportCsvJob implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;

    public function __construct(public readonly int $importId) {}

    public function handle(ImportServiceInterface $imports): void
    {
        $imports->processImport($this->importId);
    }
}
