<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\Crop;

class CropImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'crops';
    }

    public function label(): string
    {
        return 'Crop Master';
    }

    public function model(): string
    {
        return Crop::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'name_gujarati' => 'name_gujarati',
            'category' => 'category',
            'is_premium' => 'is_premium',
            'base_yield' => 'base_yield',
            'avg_price_per_qtl' => 'avg_price_per_qtl',
            'season' => 'season',
            'sowing_period' => 'sowing_period',
            'is_active' => 'is_active',
        ];
    }

    public function required(): array
    {
        return ['code', 'name', 'name_gujarati'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'name_gujarati' => ['required', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'in:traditional,high-value,controlled-environment'],
            'is_premium' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
            'base_yield' => ['nullable', 'string', 'max:50'],
            'avg_price_per_qtl' => ['nullable', 'numeric', 'between:0,9999999.99'],
            'season' => ['nullable', 'string', 'max:30'],
            'sowing_period' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
        ];
    }

    public function booleanColumns(): array
    {
        return ['is_premium', 'is_active'];
    }
}
