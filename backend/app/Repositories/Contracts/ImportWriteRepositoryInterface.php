<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Generic dataset write operations used by the CSV import engine.
 *
 * The target model is passed in per call so the same repository serves every
 * dataset driver — no dataset-specific repository is hardcoded anywhere.
 */
interface ImportWriteRepositoryInterface
{
    /**
     * Fetch full records whose unique key column is in the given values.
     *
     * @param  list<mixed>  $values
     * @return Collection<int, Model>
     */
    public function findByKeyIn(string $model, string $column, array $values): Collection;

    /**
     * Insert many records in a single statement, hydrating timestamps and
     * UUIDs when the target model expects them.
     *
     * @param  list<array<string, mixed>>  $rows
     */
    public function insertRows(string $model, array $rows): void;

    /**
     * Update every record matching the key value; returns affected rows.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function updateByKey(string $model, string $column, mixed $value, array $attributes): int;

    /**
     * Delete the given primary keys (honoring soft deletes when the model
     * uses them); returns affected rows.
     *
     * @param  list<int>  $ids
     */
    public function deleteByIds(string $model, array $ids): int;
}
