<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\District;
use App\Models\Taluka;

class TalukaImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'talukas';
    }

    public function label(): string
    {
        return 'Talukas';
    }

    public function model(): string
    {
        return Taluka::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'name_gujarati' => 'name_gujarati',
            'district_code' => 'district_id',
            'default_pincode' => 'default_pincode',
            'is_active' => 'is_active',
        ];
    }

    public function required(): array
    {
        return ['code', 'name', 'district_code'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'name_gujarati' => ['nullable', 'string', 'max:100'],
            'district_code' => ['required', 'string', 'max:50'],
            'default_pincode' => ['nullable', 'digits:6'],
            'is_active' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
        ];
    }

    public function foreignKeys(): array
    {
        return [
            'district_code' => ['model' => District::class, 'column' => 'code', 'nullable' => false],
        ];
    }
}
