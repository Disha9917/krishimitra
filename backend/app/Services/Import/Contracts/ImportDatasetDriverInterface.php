<?php

declare(strict_types=1);

namespace App\Services\Import\Contracts;

/**
 * Describes how a single master dataset is imported from CSV.
 *
 * A driver owns everything dataset-specific (headers, validation rules,
 * foreign keys and row transformation). The import engine only orchestrates.
 */
interface ImportDatasetDriverInterface
{
    public function slug(): string;

    public function label(): string;

    /**
     * The Eloquent model class written by this driver.
     */
    public function model(): string;

    /**
     * Maps expected CSV headers (lowercased) to database columns.
     *
     * @return array<string, string>
     */
    public function headerMap(): array;

    /**
     * CSV headers that must exist in the file and must not be empty per row.
     *
     * @return list<string>
     */
    public function required(): array;

    /**
     * Database columns used to match existing rows for upserts.
     *
     * @return list<string>
     */
    public function uniqueKeys(): array;

    /**
     * Per-row validation rules keyed by CSV header.
     *
     * @return array<string, mixed>
     */
    public function rules(): array;

    /**
     * CSV header => foreign key definition used for batch existence checks.
     *
     * @return array<string, array{model: string, column: string, nullable: bool}>
     */
    public function foreignKeys(): array;

    /**
     * CSV headers holding pipe-separated lists stored as JSON arrays.
     *
     * @return list<string>
     */
    public function listColumns(): array;

    /**
     * CSV headers holding boolean-ish values stored as booleans.
     *
     * @return list<string>
     */
    public function booleanColumns(): array;

    /**
     * Normalize a validated CSV row into database attributes.
     *
     * @param  array<string, mixed>  $row
     * @param  array<string, array<string, int>>  $resolvedForeignKeys
     * @return array<string, mixed>
     */
    public function transform(array $row, array $resolvedForeignKeys): array;
}
