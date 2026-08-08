<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\Taluka;
use App\Models\Village;

class VillageImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'villages';
    }

    public function label(): string
    {
        return 'Villages';
    }

    public function model(): string
    {
        return Village::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'taluka_code' => 'taluka_id',
            'pincode' => 'pincode',
            'lat' => 'lat',
            'lng' => 'lng',
        ];
    }

    public function required(): array
    {
        return ['code', 'name', 'taluka_code'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:150'],
            'taluka_code' => ['required', 'string', 'max:50'],
            'pincode' => ['nullable', 'digits:6'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function foreignKeys(): array
    {
        return [
            'taluka_code' => ['model' => Taluka::class, 'column' => 'code', 'nullable' => false],
        ];
    }
}
