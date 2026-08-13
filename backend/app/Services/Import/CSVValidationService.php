<?php

declare(strict_types=1);

namespace App\Services\Import;

use App\Repositories\Contracts\ImportWriteRepositoryInterface;
use App\Services\Import\Contracts\CSVValidationServiceInterface;
use App\Services\Import\Contracts\ImportDatasetDriverInterface;
use Illuminate\Support\Facades\Validator;

/**
 * Produces a full validation report (required columns, empty values,
 * duplicates, types, enums, foreign keys and existing rows) without
 * touching the database beyond read-only existence checks.
 */
class CSVValidationService implements CSVValidationServiceInterface
{
    public function __construct(
        private readonly ImportWriteRepositoryInterface $write,
    ) {}

    /**
     * @param  array{
     *   headers: list<string>,
     *   rows: list<array<string, string|null>>,
     *   parse_errors: list<array{row: int, message: string}>
     * }  $parsed
     * @return array{
     *   headers: list<string>,
     *   missing_headers: list<string>,
     *   total_rows: int,
     *   valid_rows: int,
     *   duplicate_rows: int,
     *   error_rows: int,
     *   existing_rows: int,
     *   errors: list<array{row: int, column: string, message: string}>,
     *   rows: list<array{row: int, data: array<string, mixed>, status: string, existing: bool, errors: list<string>}>,
     *   fk_maps: array<string, array<string, int>>
     * }
     */
    public function validate(array $parsed, ImportDatasetDriverInterface $driver): array
    {
        $headers = $parsed['headers'];
        $missingHeaders = array_values(array_filter(
            $driver->required(),
            static fn (string $required): bool => ! in_array($required, $headers, true),
        ));

        $fkMaps = $this->resolveForeignKeys($parsed['rows'], $driver);
        $existingKeys = $this->existingKeys($parsed['rows'], $driver);
        $duplicateTracker = [];

        $errors = [];
        $rows = [];
        $counts = ['valid' => 0, 'duplicate' => 0, 'error' => 0, 'existing' => 0];
        $errorCap = (int) config('import.error_cap');

        foreach ($parsed['rows'] as $index => $row) {
            $rowNumber = $index + 2;

            if ($missingHeaders !== []) {
                $errors[] = ['row' => $rowNumber, 'column' => '*', 'message' => 'Required header is missing.'];
                $counts['error']++;
                $rows[] = ['row' => $rowNumber, 'data' => $row, 'status' => 'error', 'existing' => false, 'errors' => ['Required header is missing.']];

                continue;
            }

            $rowErrors = $this->rowErrors($row, $driver, $fkMaps);
            $key = $this->rowKey($row, $driver);
            $isDuplicate = isset($duplicateTracker[$key]);
            $duplicateTracker[$key] = true;

            if ($rowErrors !== []) {
                foreach ($rowErrors as $column => $messages) {
                    foreach ($messages as $message) {
                        $errors[] = ['row' => $rowNumber, 'column' => $column, 'message' => $message];
                    }
                }

                $counts['error']++;
                $rows[] = ['row' => $rowNumber, 'data' => $row, 'status' => 'error', 'existing' => false, 'errors' => array_values($rowErrors)];

                continue;
            }

            if ($isDuplicate) {
                $counts['duplicate']++;
                $rows[] = ['row' => $rowNumber, 'data' => $row, 'status' => 'duplicate', 'existing' => false, 'errors' => []];

                continue;
            }

            $existing = isset($existingKeys[$key]);

            if ($existing) {
                $counts['existing']++;
            }

            $counts['valid']++;
            $rows[] = ['row' => $rowNumber, 'data' => $row, 'status' => 'valid', 'existing' => $existing, 'errors' => []];
        }

        foreach ($parsed['parse_errors'] as $parseError) {
            $counts['error']++;
            $errors[] = ['row' => $parseError['row'], 'column' => '*', 'message' => $parseError['message']];
        }

        return [
            'headers' => $headers,
            'missing_headers' => $missingHeaders,
            'total_rows' => count($parsed['rows']) + count($parsed['parse_errors']),
            'valid_rows' => $counts['valid'],
            'duplicate_rows' => $counts['duplicate'],
            'error_rows' => $counts['error'],
            'existing_rows' => $counts['existing'],
            'errors' => array_slice($errors, 0, $errorCap),
            'rows' => $rows,
            'fk_maps' => $fkMaps,
        ];
    }

    /**
     * @param  list<array<string, string|null>>  $rows
     * @return array<string, array<string, int>>
     */
    private function resolveForeignKeys(array $rows, ImportDatasetDriverInterface $driver): array
    {
        $maps = [];

        foreach ($driver->foreignKeys() as $header => $foreignKey) {
            $values = [];

            foreach ($rows as $row) {
                $value = $row[$header] ?? null;

                if ($value !== null && trim($value) !== '') {
                    $values[] = $value;
                }
            }

            $values = array_values(array_unique($values));

            if ($values === []) {
                $maps[$header] = [];

                continue;
            }

            $found = $this->write->findByKeyIn($foreignKey['model'], $foreignKey['column'], $values);
            $maps[$header] = $found->pluck('id', $foreignKey['column'])
                ->map(static fn ($id): int => (int) $id)
                ->all();
        }

        return $maps;
    }

    /**
     * @param  list<array<string, string|null>>  $rows
     * @return array<string, true>
     */
    private function existingKeys(array $rows, ImportDatasetDriverInterface $driver): array
    {
        $keyColumn = $this->keyColumn($driver);

        if ($keyColumn === null) {
            return [];
        }

        $values = [];

        foreach ($rows as $row) {
            $header = $this->headerForKeyColumn($driver, $keyColumn);

            if ($header === null) {
                continue;
            }

            $value = $row[$header] ?? null;

            if ($value !== null && trim($value) !== '') {
                $values[] = $value;
            }
        }

        $values = array_values(array_unique($values));

        if ($values === []) {
            return [];
        }

        return $this->write->findByKeyIn($driver->model(), $keyColumn, $values)
            ->pluck($keyColumn)
            ->flip()
            ->map(static fn (): bool => true)
            ->all();
    }

    /**
     * @param  array<string, mixed>  $row
     * @param  array<string, array<string, int>>  $fkMaps
     * @return array<string, list<string>>
     */
    private function rowErrors(array $row, ImportDatasetDriverInterface $driver, array $fkMaps): array
    {
        $validator = Validator::make($row, $driver->rules());
        $errors = [];

        foreach ($validator->errors()->messages() as $column => $messages) {
            $errors[$column] = $messages;
        }

        foreach ($driver->foreignKeys() as $header => $foreignKey) {
            $value = $row[$header] ?? null;

            if ($value === null || trim((string) $value) === '') {
                if (! $foreignKey['nullable']) {
                    $errors[$header] = ['The '.$header.' must reference an existing record.'];
                }

                continue;
            }

            if (! isset($fkMaps[$header][$value])) {
                $errors[$header] = ['The '.$header.' ['.$value.'] does not exist in the master data.'];
            }
        }

        return $errors;
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function rowKey(array $row, ImportDatasetDriverInterface $driver): string
    {
        $parts = [];

        foreach ($driver->uniqueKeys() as $column) {
            $header = $this->headerForKeyColumn($driver, $column) ?? $column;
            $parts[] = (string) ($row[$header] ?? '');
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
