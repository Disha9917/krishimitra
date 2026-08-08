<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Services\Import\Contracts\ImportDatasetDriverInterface;

abstract class AbstractImportDriver implements ImportDatasetDriverInterface
{
    public function required(): array
    {
        return [];
    }

    public function uniqueKeys(): array
    {
        return ['code'];
    }

    public function foreignKeys(): array
    {
        return [];
    }

    public function listColumns(): array
    {
        return [];
    }

    public function booleanColumns(): array
    {
        return ['is_active'];
    }

    /**
     * @param  array<string, mixed>  $row
     * @param  array<string, array<string, int>>  $resolvedForeignKeys
     * @return array<string, mixed>
     */
    public function transform(array $row, array $resolvedForeignKeys): array
    {
        $attributes = [];

        foreach ($this->headerMap() as $header => $column) {
            $value = $row[$header] ?? null;

            if (in_array($header, $this->listColumns(), true)) {
                $attributes[$column] = $this->listValue($value);

                continue;
            }

            if ($value === null || (is_string($value) && trim($value) === '')) {
                continue;
            }

            if (in_array($header, $this->booleanColumns(), true)) {
                $attributes[$column] = $this->boolValue($value);

                continue;
            }

            $attributes[$column] = $value;
        }

        foreach ($this->foreignKeys() as $header => $foreignKey) {
            $value = $row[$header] ?? null;
            $targetColumn = $this->headerMap()[$header] ?? $foreignKey['column'];

            if ($value === null || (is_string($value) && trim($value) === '')) {
                $attributes[$targetColumn] = null;

                continue;
            }

            $attributes[$targetColumn] = $resolvedForeignKeys[$header][$value] ?? null;
        }

        return $attributes;
    }

    protected function boolValue(mixed $value): ?bool
    {
        $normalized = strtolower(trim((string) $value));

        return match ($normalized) {
            '1', 'true', 'yes', 'y' => true,
            '0', 'false', 'no', 'n' => false,
            default => null,
        };
    }

    /**
     * @return list<string>
     */
    protected function listValue(mixed $value): array
    {
        if ($value === null || trim((string) $value) === '') {
            return [];
        }

        return array_values(array_filter(
            array_map('trim', explode('|', (string) $value)),
            static fn (string $item): bool => $item !== '',
        ));
    }
}
