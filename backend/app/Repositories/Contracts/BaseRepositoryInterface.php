<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseRepositoryInterface
{
    /**
     * Find a record by its primary key.
     */
    public function findById(int $id): ?Model;

    /**
     * Find a record by its public UUID (only on models exposing a uuid column).
     */
    public function findByUuid(string $uuid): ?Model;

    /**
     * Retrieve every record.
     */
    public function findAll(): Collection;

    /**
     * Paginate the result set.
     */
    public function paginate(int $perPage = 15, array $columns = ['*'], string $pageName = 'page', ?int $page = null): LengthAwarePaginator;

    /**
     * Persist a new record.
     */
    public function create(array $attributes): Model;

    /**
     * Update an existing record by primary key.
     */
    public function update(int $id, array $attributes): ?Model;

    /**
     * Delete (soft or hard, per model) a record by primary key.
     */
    public function delete(int $id): bool;

    /**
     * Restore a soft-deleted record by primary key.
     */
    public function restore(int $id): ?Model;

    /**
     * Permanently delete a record by primary key.
     */
    public function forceDelete(int $id): bool;

    /**
     * Determine whether a record exists by primary key.
     */
    public function exists(int $id): bool;

    /**
     * Count every record.
     */
    public function count(): int;

    /**
     * Fetch records matching a set of column/value criteria.
     */
    public function findWhere(array $criteria): Collection;

    /**
     * Fetch the first record matching a set of column/value criteria.
     */
    public function findFirstWhere(array $criteria): ?Model;

    /**
     * Full-text style search across the given columns (case-insensitive).
     */
    public function search(array $columns, string $term): Collection;

    /**
     * Fetch records applying equality filters; array values become whereIn.
     */
    public function filter(array $filters): Collection;

    /**
     * Fetch every record ordered by the given column/direction criteria.
     */
    public function sort(array $criteria): Collection;

    /**
     * Insert many records in a single statement.
     */
    public function bulkInsert(array $rows): bool;

    /**
     * Mass-update every record matching the criteria; returns affected rows.
     */
    public function bulkUpdate(array $criteria, array $attributes): int;
}
