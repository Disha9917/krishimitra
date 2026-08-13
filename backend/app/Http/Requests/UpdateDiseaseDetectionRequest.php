<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiseaseDetectionRequest extends FormRequest
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
            'fieldId' => ['sometimes', 'integer', 'exists:farmer_fields,id'],
            'cropId' => ['sometimes', 'integer', 'exists:crops,id'],
            'diseaseId' => ['sometimes', 'nullable', 'integer', 'exists:diseases,id'],
            'diseaseName' => ['sometimes', 'string', 'max:150'],
            'scientificName' => ['sometimes', 'nullable', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'symptoms' => ['sometimes', 'nullable', 'array', 'max:30'],
            'symptoms.*' => ['string', 'max:255'],
            'confidenceScore' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'severity' => ['sometimes', 'string', 'in:low,medium,high,critical'],
            'detectionSource' => ['sometimes', 'string', 'in:manual,ai'],
            'detectionStatus' => ['sometimes', 'string', 'in:pending,confirmed,treated,dismissed'],
            'treatmentSnapshot' => ['sometimes', 'nullable', 'array'],
            'modelVersion' => ['sometimes', 'nullable', 'string', 'max:30'],
            'detectedAt' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
