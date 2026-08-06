<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFieldRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'sizeAcres' => ['required', 'numeric', 'min:0.01', 'max:100000'],
            'soilTypeId' => ['sometimes', 'nullable', 'integer', 'exists:soil_types,id'],
            'currentCropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'lat' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
        ];
    }
}
