<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSoilTestRequest extends FormRequest
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
            'fieldId' => ['required', 'integer', 'exists:farmer_fields,id'],
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'labName' => ['sometimes', 'nullable', 'string', 'max:150'],
            'reportDate' => ['sometimes', 'nullable', 'date'],
            'reportFileId' => ['sometimes', 'nullable', 'integer', 'exists:uploaded_files,id'],
            'ph' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:14'],
            'ec' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:20'],
            'nitrogenKgHa' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:5000'],
            'phosphorusKgHa' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:5000'],
            'potassiumKgHa' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:5000'],
            'organicCarbonPct' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:10'],
            'moisturePct' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'micronutrients' => ['sometimes', 'nullable', 'array'],
            'micronutrients.*' => ['numeric', 'min:0'],
            'soilTexture' => ['sometimes', 'nullable', 'string', 'max:50'],
            'soilTypeId' => ['sometimes', 'nullable', 'integer', 'exists:soil_types,id'],
        ];
    }
}
