<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\SoilType;

class SoilTypeImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'soil_types';
    }

    public function label(): string
    {
        return 'Soil Types';
    }

    public function model(): string
    {
        return SoilType::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'water_retention_desc' => 'water_retention_desc',
        ];
    }

    public function required(): array
    {
        return ['code', 'name'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'water_retention_desc' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
