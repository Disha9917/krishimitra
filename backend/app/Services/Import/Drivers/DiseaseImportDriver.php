<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\Crop;
use App\Models\Disease;

class DiseaseImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'diseases';
    }

    public function label(): string
    {
        return 'Disease Master';
    }

    public function model(): string
    {
        return Disease::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'name' => 'name',
            'scientific_name' => 'scientific_name',
            'crop_code' => 'crop_id',
            'severity_default' => 'severity_default',
            'symptoms' => 'symptoms',
            'preventive_measures' => 'preventive_measures',
            'chemical_treatments' => 'chemical_treatments',
            'organic_treatments' => 'organic_treatments',
            'recommended_product' => 'recommended_product',
            'dosage' => 'dosage',
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
            'name' => ['required', 'string', 'max:150'],
            'scientific_name' => ['nullable', 'string', 'max:150'],
            'crop_code' => ['nullable', 'string', 'max:50'],
            'severity_default' => ['nullable', 'string', 'in:Mild,Moderate,Severe'],
            'symptoms' => ['nullable', 'string', 'max:2000'],
            'preventive_measures' => ['nullable', 'string', 'max:2000'],
            'chemical_treatments' => ['nullable', 'string', 'max:2000'],
            'organic_treatments' => ['nullable', 'string', 'max:2000'],
            'recommended_product' => ['nullable', 'string', 'max:255'],
            'dosage' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function foreignKeys(): array
    {
        return [
            'crop_code' => ['model' => Crop::class, 'column' => 'code', 'nullable' => true],
        ];
    }

    public function listColumns(): array
    {
        return ['symptoms', 'preventive_measures', 'chemical_treatments', 'organic_treatments'];
    }

    public function booleanColumns(): array
    {
        return [];
    }
}
