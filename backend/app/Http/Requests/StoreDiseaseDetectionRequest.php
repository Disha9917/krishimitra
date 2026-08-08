<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiseaseDetectionRequest extends FormRequest
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
            'cropId' => ['required', 'integer', 'exists:crops,id'],
            'diseaseId' => ['sometimes', 'nullable', 'integer', 'exists:diseases,id'],
            'diseaseName' => ['required', 'string', 'max:150'],
            'scientificName' => ['sometimes', 'nullable', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'symptoms' => ['sometimes', 'nullable', 'array', 'max:30'],
            'symptoms.*' => ['string', 'max:255'],
            'confidenceScore' => ['required', 'numeric', 'min:0', 'max:100'],
            'severity' => ['required', 'string', 'in:low,medium,high,critical'],
            'detectionSource' => ['sometimes', 'string', 'in:manual,ai'],
            'detectionStatus' => ['sometimes', 'string', 'in:pending,confirmed,treated,dismissed'],
            'treatmentSnapshot' => ['sometimes', 'nullable', 'array'],
            'modelVersion' => ['sometimes', 'nullable', 'string', 'max:30'],
            'detectedAt' => ['sometimes', 'nullable', 'date'],
            'imageFileIds' => ['sometimes', 'array', 'max:5'],
            'imageFileIds.*' => ['integer', 'exists:uploaded_files,id'],
        ];
    }
}
