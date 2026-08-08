<?php

declare(strict_types=1);

namespace App\Services\Import\Contracts;

interface CSVValidationServiceInterface
{
    /**
     * Validate a parsed file against a dataset driver. Nothing is written.
     *
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
    public function validate(array $parsed, ImportDatasetDriverInterface $driver): array;
}
