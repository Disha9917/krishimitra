<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\District;
use App\Models\Mandi;

class MandiImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'mandis';
    }

    public function label(): string
    {
        return 'Mandis';
    }

    public function model(): string
    {
        return Mandi::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'state' => 'state',
            'district_code' => 'district_id',
            'pincode' => 'pincode',
            'lat' => 'lat',
            'lng' => 'lng',
            'apmc_id_external' => 'apmc_id_external',
            'is_active' => 'is_active',
        ];
    }

    public function required(): array
    {
        return ['code', 'name', 'state'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:150'],
            'state' => ['required', 'string', 'max:50'],
            'district_code' => ['nullable', 'string', 'max:50'],
            'pincode' => ['nullable', 'digits:6'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'apmc_id_external' => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
        ];
    }

    public function foreignKeys(): array
    {
        return [
            'district_code' => ['model' => District::class, 'column' => 'code', 'nullable' => true],
        ];
    }
}
