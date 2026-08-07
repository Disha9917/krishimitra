<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use InvalidArgumentException;
use LogicException;

abstract class BaseEloquentRepository implements BaseRepositoryInterface
{
    /**
     * The Eloquent model instance used for every query.
     */
    protected readonly Model $model;

    /**
     * Whether the bound model makes use of the SoftDeletes trait.
     */
    private readonly bool $supportsSoftDeletes;

    public function __construct(Model $model)
    {
        $this->model = $model;
        $this->supportsSoftDeletes = in_array(SoftDeletes::class, class_uses_recursive($model), true);
    }

    public function findById(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Model
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function findAll(): Collection
    {
        return $this->model->get();
    }

    public function paginate(int $perPage = 15, array $columns = ['*'], string $pageName = 'page', ?int $page = null): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns, $pageName, $page);
    }

    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    public function update(int $id, array $attributes): ?Model
    {
        $record = $this->model->find($id);

        if ($record === null) {
            return null;
        }

        $record->update($attributes);

        return $record;
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->find($id)?->delete();
    }

    public function restore(int $id): ?Model
    {
        $this->assertSupportsSoftDeletes('restore');

        $record = $this->model->onlyTrashed()->find($id);

        if ($record === null) {
            return null;
        }

        $record->restore();

        return $record;
    }

    public function forceDelete(int $id): bool
    {
        $this->assertSupportsSoftDeletes('forceDelete');

        return (bool) $this->model->withTrashed()->find($id)?->forceDelete();
    }

    public function exists(int $id): bool
    {
        return $this->model->whereKey($id)->exists();
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function findWhere(array $criteria): Collection
    {
        if ($criteria === []) {
            return $this->model->get();
        }

        return $this->model->where($criteria)->get();
    }

    public function findFirstWhere(array $criteria): ?Model
    {
        if ($criteria === []) {
            return null;
        }

        return $this->model->where($criteria)->first();
    }

    public function search(array $columns, string $term): Collection
    {
        return $this->model
            ->where(function (Builder $query) use ($columns, $term): void {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'ilike', '%' . $term . '%');
                }
            })
            ->get();
    }

    public function filter(array $filters): Collection
    {
        $query = $this->model->newQuery();

        foreach ($filters as $column => $value) {
            if (is_array($value)) {
                $query->whereIn($column, $value);
            } else {
                $query->where($column, $value);
            }
        }

        return $query->get();
    }

    public function sort(array $criteria): Collection
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $column => $direction) {
            $query->orderBy($column, $direction);
        }

        return $query->get();
    }

    public function bulkInsert(array $rows): bool
    {
        return $this->model->insert($rows);
    }

    public function bulkUpdate(array $criteria, array $attributes): int
    {
        if ($criteria === []) {
            throw new InvalidArgumentException('bulkUpdate() requires at least one criteria.');
        }

        return $this->model->where($criteria)->update($attributes);
    }

    /**
     * Guard soft-delete operations for models that do not use SoftDeletes.
     */
    private function assertSupportsSoftDeletes(string $operation): void
    {
        if (!$this->supportsSoftDeletes) {
            throw new LogicException(sprintf(
                '[%s] does not use the SoftDeletes trait; %s() is not supported.',
                $this->model::class,
                $operation
            ));
        }
    }
}
