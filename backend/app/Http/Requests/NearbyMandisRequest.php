<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class NearbyMandisRequest extends FormRequest
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
            'lat' => ['sometimes', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'numeric', 'between:-180,180'],
            'radiusKm' => ['sometimes', 'numeric', 'min:1', 'max:500'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator): void {
            $hasField = $this->filled('fieldId');
            $hasCoordinates = $this->filled('lat') && $this->filled('lng');

            if (! $hasField && ! $hasCoordinates) {
                $validator->errors()->add('fieldId', 'Provide either a fieldId or both lat and lng.');
            }

            if ($hasField && $hasCoordinates) {
                $validator->errors()->add('fieldId', 'Provide either a fieldId or lat/lng, not both.');
            }
        });
    }
}
