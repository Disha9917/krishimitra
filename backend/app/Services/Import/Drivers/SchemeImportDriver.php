<?php

declare(strict_types=1);

namespace App\Services\Import\Drivers;

use App\Models\GovernmentScheme;

class SchemeImportDriver extends AbstractImportDriver
{
    public function slug(): string
    {
        return 'schemes';
    }

    public function label(): string
    {
        return 'Government Schemes';
    }

    public function model(): string
    {
        return GovernmentScheme::class;
    }

    public function headerMap(): array
    {
        return [
            'code' => 'code',
            'title' => 'title',
            'category' => 'category',
            'description' => 'description',
            'benefits' => 'benefits',
            'eligibility_criteria' => 'eligibility_criteria',
            'documents_required' => 'documents_required',
            'state' => 'state',
            'deadline' => 'deadline',
            'apply_url' => 'apply_url',
            'official_link' => 'official_link',
            'is_active' => 'is_active',
        ];
    }

    public function required(): array
    {
        return ['code', 'title', 'category'];
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:5000'],
            'benefits' => ['nullable', 'string', 'max:5000'],
            'eligibility_criteria' => ['nullable', 'string', 'max:5000'],
            'documents_required' => ['nullable', 'string', 'max:5000'],
            'state' => ['nullable', 'string', 'max:50'],
            'deadline' => ['nullable', 'date'],
            'apply_url' => ['nullable', 'string', 'max:255'],
            'official_link' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'string', 'in:true,false,1,0,yes,no'],
        ];
    }

    public function listColumns(): array
    {
        return ['benefits', 'eligibility_criteria', 'documents_required'];
    }
}
