<?php

declare(strict_types=1);

namespace App\Services\Import;

use App\Jobs\ImportCsvJob;
use App\Models\ImportHistory;
use App\Models\ImportLog;
use App\Repositories\Contracts\ImportWriteRepositoryInterface;
use App\Services\Import\Contracts\CSVParserInterface;
use App\Services\Import\Contracts\CSVValidationServiceInterface;
use App\Services\Import\Contracts\ImportDatasetDriverInterface;
use App\Services\Import\Contracts\ImportHistoryServiceInterface;
use App\Services\Import\Contracts\ImportServiceInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

/**
 * Orchestrates the CSV import lifecycle:
 *
 *   validate/preview (read-only report)
 *        ↓
 *   import (store file + history, sync or queued)
 *        ↓
 *   processImport (chunked transactions, batch upserts, per-row logs)
 *        ↓
 *   rollback (delete inserted rows, restore updated before-images)
 *
 * Controllers never parse or transform CSV — everything funnels through here.
 */
class ImportService implements ImportServiceInterface
{
    public function __construct(
        private readonly CSVParserInterface $parser,
        private readonly CSVValidationServiceInterface $validator,
        private readonly ImportHistoryServiceInterface $histories,
        private readonly ImportWriteRepositoryInterface $write,
    ) {}

    public function driver(string $datasetType): ImportDatasetDriverInterface
    {
        $driverClass = config('import.datasets.'.$datasetType);

        if (! is_string($driverClass) || ! class_exists($driverClass)) {
            throw new InvalidArgumentException(sprintf('Dataset [%s] is not supported.', $datasetType));
        }

        $driver = app($driverClass);

        if (! $driver instanceof ImportDatasetDriverInterface) {
            throw new InvalidArgumentException(sprintf('Driver [%s] does not implement ImportDatasetDriverInterface.', $driverClass));
        }

        return $driver;
    }

    /**
     * @return array<string, mixed>
     */
    public function validateFile(UploadedFile $file, string $datasetType): array
    {
        return $this->report($file, $datasetType, includePreview: false, includeRowStatuses: false);
    }

    /**
     * @return array<string, mixed>
     */
    public function preview(UploadedFile $file, string $datasetType): array
    {
        return $this->report($file, $datasetType, includePreview: true, includeRowStatuses: false);
    }

    public function import(int $userId, UploadedFile $file, string $datasetType): ImportHistory
    {
        $driver = $this->driver($datasetType);
        $parsed = $this->parser->parse($file->getRealPath());
        $report = $this->validator->validate($parsed, $driver);

        if ($report['missing_headers'] !== []) {
            throw new DomainException(sprintf(
                'Missing required columns: %s.',
                implode(', ', $report['missing_headers']),
            ));
        }

        if ($report['valid_rows'] === 0) {
            throw new DomainException('The file contains no valid rows to import.');
        }

        $uuid = (string) Str::uuid();
        $directory = rtrim((string) config('import.path_prefix'), '/').'/'.$userId;
        $stored = $file->storeAs($directory, $uuid.'.csv', ['disk' => (string) config('import.disk')]);

        if ($stored === false) {
            throw new RuntimeException('Unable to store the uploaded CSV file.');
        }

        $history = $this->histories->create(
            $userId,
            $datasetType,
            $file->getClientOriginalName(),
            $stored,
            $report,
        );

        if ($report['valid_rows'] <= (int) config('import.sync_threshold')) {
            $this->processImport((int) $history->id);
        } else {
            $this->histories->markQueued((int) $history->id);
            ImportCsvJob::dispatch((int) $history->id);
        }

        return $this->histories->find((int) $history->id) ?? $history;
    }

    public function processImport(int $importId): void
    {
        $history = $this->histories->find($importId);

        if ($history === null) {
            return;
        }

        $driver = $this->driver((string) $history->dataset_type);
        $filePath = Storage::disk((string) config('import.disk'))->path((string) $history->file_path);

        try {
            $parsed = $this->parser->parse($filePath);
            $report = $this->validator->validate($parsed, $driver);

            $this->histories->markProcessing($importId, now()->microsecond(0));
            $started = hrtime(true);

            $totals = ['inserted' => 0, 'updated' => 0, 'skipped' => 0, 'failed' => 0];

            foreach (array_chunk($report['rows'], (int) config('import.batch_size')) as $chunk) {
                $totals = $this->processChunk($history, $driver, $report['fk_maps'], $chunk, $totals);
            }

            $durationMs = (int) ((hrtime(true) - $started) / 1_000_000);

            $this->histories->complete($importId, $totals['failed'], $durationMs);
        } catch (Throwable $exception) {
            $this->histories->fail($importId, $exception->getMessage());
        }
    }

    public function rollback(int $importId): ?ImportHistory
    {
        $history = $this->histories->find($importId);

        if ($history === null) {
            return null;
        }

        if (! in_array($history->status, ['imported', 'partial'], true)) {
            throw new DomainException(sprintf(
                'Import [%s] cannot be rolled back while its status is [%s].',
                $history->uuid,
                $history->status,
            ));
        }

        $driver = $this->driver((string) $history->dataset_type);

        DB::transaction(function () use ($history, $driver): void {
            $logs = $this->histories->logs((int) $history->id);
            $insertedIds = $logs
                ->where('action', 'inserted')
                ->pluck('entity_id')
                ->filter()
                ->values()
                ->all();

            if ($insertedIds !== []) {
                $this->write->deleteByIds($driver->model(), $insertedIds);
            }

            foreach ($logs->where('action', 'updated') as $log) {
                $before = (array) ($log->before_data ?? []);

                if ($log->entity_id === null || $before === []) {
                    continue;
                }

                $this->write->updateByKey($driver->model(), 'id', $log->entity_id, $before);
            }

            $this->histories->markRolledBack((int) $history->id);
        });

        return $this->histories->find($importId);
    }

    /**
     * @return Collection<int, ImportHistory>
     */
    public function history(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection
    {
        return $this->histories->list($datasetType, $status, $limit);
    }

    public function find(int $importId): ?ImportHistory
    {
        return $this->histories->find($importId);
    }

    /**
     * @return Collection<int, ImportLog>
     */
    public function logs(int $importId): Collection
    {
        return $this->histories->logs($importId);
    }

    /**
     * @return array<string, mixed>
     */
    private function report(UploadedFile $file, string $datasetType, bool $includePreview, bool $includeRowStatuses): array
    {
        $driver = $this->driver($datasetType);
        $parsed = $this->parser->parse($file->getRealPath());
        $report = $this->validator->validate($parsed, $driver);

        $payload = [
            'dataset_type' => $driver->slug(),
            'dataset_label' => $driver->label(),
            'file_name' => $file->getClientOriginalName(),
            'headers' => $report['headers'],
            'missing_headers' => $report['missing_headers'],
            'total_rows' => $report['total_rows'],
            'valid_rows' => $report['valid_rows'],
            'duplicate_rows' => $report['duplicate_rows'],
            'existing_rows' => $report['existing_rows'],
            'error_rows' => $report['error_rows'],
            'errors' => $report['errors'],
        ];

        if ($includePreview) {
            $sample = (int) config('import.preview_sample_size');
            $preview = [];

            foreach ($report['rows'] as $row) {
                if ($row['status'] === 'valid' && count($preview) < $sample) {
                    $preview[] = $row['data'];
                }
            }

            $payload['preview'] = $preview;
        }

        if ($includeRowStatuses) {
            $payload['row_statuses'] = array_map(
                static fn (array $row): array => [
                    'row' => $row['row'],
                    'status' => $row['status'],
                    'existing' => $row['existing'],
                ],
                array_slice($report['rows'], 0, (int) config('import.error_cap')),
            );
        }

        return $payload;
    }

    /**
     * @param  list<array{row: int, data: array<string, mixed>, status: string, existing: bool, errors: list<string>}>  $chunk
     * @param  array<string, int>  $totals
     * @return array<string, int>
     */
    private function processChunk(ImportHistory $history, ImportDatasetDriverInterface $driver, array $fkMaps, array $chunk, array $totals): array
    {
        DB::transaction(function () use ($history, $driver, $fkMaps, $chunk, &$totals): void {
            $insertRows = [];
            $insertKeys = [];

            foreach ($chunk as $row) {
                if ($row['status'] === 'duplicate') {
                    $this->histories->logRow(
                        (int) $history->id,
                        $row['row'],
                        'skipped',
                        null,
                        $this->rowKey($driver, $row['data']),
                        'Duplicate row within the file.',
                    );
                    $totals['skipped']++;

                    continue;
                }

                if ($row['status'] === 'error') {
                    $messages = array_merge([], ...array_values($row['errors']));

                    $this->histories->logRow(
                        (int) $history->id,
                        $row['row'],
                        'failed',
                        null,
                        $this->rowKey($driver, $row['data']),
                        $messages[0] ?? 'Row failed validation.',
                    );
                    $totals['failed']++;

                    continue;
                }

                $attributes = $driver->transform($row['data'], $fkMaps);
                $key = $this->rowKey($driver, $row['data']);

                if ($row['existing']) {
                    $this->upsertUpdate($history, $driver, $row, $key, $attributes, $totals);
                } else {
                    $insertKeys[] = $key;
                    $insertRows[$key] = $attributes;
                }
            }

            if ($insertRows !== []) {
                $this->write->insertRows($driver->model(), array_values($insertRows));
                $keyColumn = $this->keyColumn($driver);

                if ($keyColumn !== null) {
                    $inserted = $this->write->findByKeyIn($driver->model(), $keyColumn, array_keys($insertRows));
                    $idsByKey = $inserted->pluck('id', $keyColumn)->map(static fn ($id): int => (int) $id)->all();

                    foreach ($chunk as $row) {
                        if ($row['status'] !== 'valid' || $row['existing']) {
                            continue;
                        }

                        $key = $this->rowKey($driver, $row['data']);

                        if (! isset($insertRows[$key])) {
                            continue;
                        }

                        $this->histories->logRow(
                            (int) $history->id,
                            $row['row'],
                            'inserted',
                            $idsByKey[$key] ?? null,
                            $key,
                            'Inserted.',
                        );
                        $totals['inserted']++;
                    }
                }
            }

            $this->histories->updateProgress(
                (int) $history->id,
                $totals['inserted'],
                $totals['updated'],
                $totals['skipped'],
                $totals['failed'],
            );
        });

        return $totals;
    }

    /**
     * @param  array{row: int, data: array<string, mixed>, status: string, existing: bool, errors: list<string>}  $row
     * @param  array<string, mixed>  $attributes
     * @param  array<string, int>  $totals
     */
    private function upsertUpdate(ImportHistory $history, ImportDatasetDriverInterface $driver, array $row, string $key, array $attributes, array &$totals): void
    {
        $keyColumn = $this->keyColumn($driver);

        if ($keyColumn === null) {
            return;
        }

        $header = $this->headerForKeyColumn($driver, $keyColumn);

        if ($header === null) {
            return;
        }

        $keyValue = (string) ($row['data'][$header] ?? '');
        $existing = $this->write->findByKeyIn($driver->model(), $keyColumn, [$keyValue])->first();

        if ($existing === null) {
            return;
        }

        $before = $existing->getAttributes();
        unset($before['updated_at']);

        $this->write->updateByKey($driver->model(), 'id', $existing->id, $attributes);

        $this->histories->logRow(
            (int) $history->id,
            $row['row'],
            'updated',
            $existing->id,
            $key,
            'Updated.',
            $before,
        );
        $totals['updated']++;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function rowKey(ImportDatasetDriverInterface $driver, array $data): string
    {
        $parts = [];

        foreach ($driver->uniqueKeys() as $column) {
            $header = $this->headerForKeyColumn($driver, $column) ?? $column;
            $parts[] = (string) ($data[$header] ?? '');
        }

        return implode('|', $parts);
    }

    private function keyColumn(ImportDatasetDriverInterface $driver): ?string
    {
        $keys = $driver->uniqueKeys();

        return $keys[0] ?? null;
    }

    private function headerForKeyColumn(ImportDatasetDriverInterface $driver, string $column): ?string
    {
        $header = array_search($column, $driver->headerMap(), true);

        return $header === false ? null : $header;
    }
}
