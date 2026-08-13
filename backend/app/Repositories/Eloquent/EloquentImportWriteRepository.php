<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\ImportWriteRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EloquentImportWriteRepository implements ImportWriteRepositoryInterface
{
    /**
     * @param  list<mixed>  $values
     * @return Collection<int, Model>
     */
    public function findByKeyIn(string $model, string $column, array $values): Collection
    {
        if ($values === []) {
            return new Collection;
        }

        return (new $model)->whereIn($column, $values)->get();
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    public function insertRows(string $model, array $rows): void
    {
        if ($rows === []) {
            return;
        }

        $instance = new $model;
        $usesUuids = in_array(HasUuids::class, class_uses_recursive($instance), true);
        $usesTimestamps = $instance->usesTimestamps();
        $now = now();

        foreach ($rows as &$row) {
            if ($usesUuids && ! isset($row['uuid'])) {
                $row['uuid'] = (string) Str::uuid();
            }

            if ($usesTimestamps) {
                $row['created_at'] ??= $now;
                $row['updated_at'] ??= $now;
            }
        }

        unset($row);

        $instance->insert(array_values($rows));
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function updateByKey(string $model, string $column, mixed $value, array $attributes): int
    {
        return (new $model)->where($column, $value)->update($attributes);
    }

    /**
     * @param  list<int>  $ids
     */
    public function deleteByIds(string $model, array $ids): int
    {
        if ($ids === []) {
            return 0;
        }

        $records = (new $model)->whereIn('id', $ids)->get();

        foreach ($records as $record) {
            $record->delete();
        }

        return $records->count();
    }
}
