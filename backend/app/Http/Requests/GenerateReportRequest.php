<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'report_type' => ['required', 'string', Rule::in(array_keys(config('report.types')))],
            'format' => ['required', 'string', Rule::in(['csv', 'pdf', 'both'])],
            'title' => ['nullable', 'string', 'max:255'],
            'filters' => ['nullable', 'array'],
            'filters.farmer_id' => ['nullable', 'integer', 'exists:users,id'],
            'filters.crop_id' => ['nullable', 'integer', 'exists:crops,id'],
            'filters.field_id' => ['nullable', 'integer', 'exists:farmer_fields,id'],
            'filters.district_id' => ['nullable', 'integer', 'exists:districts,id'],
            'filters.taluka_id' => ['nullable', 'integer', 'exists:talukas,id'],
            'filters.village_id' => ['nullable', 'integer', 'exists:villages,id'],
            'filters.mandi_id' => ['nullable', 'integer', 'exists:mandis,id'],
            'filters.disease_id' => ['nullable', 'integer', 'exists:diseases,id'],
            'filters.scheme_id' => ['nullable', 'integer', 'exists:government_schemes,id'],
            'filters.season' => ['nullable', 'string', 'max:30'],
            'filters.from' => ['nullable', 'date'],
            'filters.to' => ['nullable', 'date', 'after_or_equal:filters.from'],
            'filters.sections' => ['nullable', 'string', 'regex:/^[a-z]+(,[a-z]+)*$/'],
        ];
    }
}
