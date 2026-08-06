<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCropRequest extends FormRequest
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
            'cropId' => ['sometimes', 'integer', 'exists:crops,id'],
            'fieldId' => ['sometimes', 'integer', 'exists:farmer_fields,id'],
            'season' => ['sometimes', 'string', 'max:30'],
            'sowingDate' => ['sometimes', 'nullable', 'date'],
            'expectedHarvestDate' => ['sometimes', 'nullable', 'date'],
            'isCurrent' => ['sometimes', 'boolean'],
            'allowOverlap' => ['sometimes', 'boolean'],
        ];
    }
}
