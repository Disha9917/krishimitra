<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\District;
use App\Models\Region;

class DistrictImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'districts';
    }

    public function label(): string
    {
        return 'Districts';
    }

    public function model(): string
    {
        return District::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'name_gujarati' => 'name_gujarati',
            'region_code' => 'region_id',
            'default_pincode' => 'default_pincode',
            'is_active' => 'is_active',
        ];
    }

    public function required(): array
    {
        return ['code', 'name', 'region_code'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'name_gujarati' => ['nullable', 'string', 'max:100'],
            'region_code' => ['required', 'string', 'max:50'],
            'default_pincode' => ['nullable', 'digits:6'],
            'is_active' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
        ];
    }

    public function foreignKeys(): array
    {
        return [
            'region_code' => ['model' => Region::class, 'column' => 'code', 'nullable' => false],
        ];
    }
}
