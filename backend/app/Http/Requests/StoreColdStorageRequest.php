<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreColdStorageRequest extends FormRequest
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
            'description' => ['nullable', 'string', 'max:2000'],
            'contactPhone' => ['nullable', 'string', 'max:15'],
            'pincode' => ['required', 'string', 'digits:6'],
            'districtId' => ['required', 'integer', 'exists:districts,id'],
            'talukaId' => ['nullable', 'integer', 'exists:talukas,id'],
            'villageId' => ['nullable', 'integer', 'exists:villages,id'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'capacityTonnes' => ['required', 'numeric', 'gt:0'],
            'tempRangeC' => ['nullable', 'string', 'max:30'],
            'minTempC' => ['nullable', 'numeric', 'between:-50,60'],
            'maxTempC' => ['nullable', 'numeric', 'between:-50,60'],
            'humidityRange' => ['nullable', 'string', 'max:30'],
            'supportedCrops' => ['nullable', 'array', 'max:50'],
            'supportedCrops.*' => ['integer', 'exists:crops,id'],
            'ratePerTonneMonth' => ['required', 'numeric', 'gt:0'],
            'isActive' => ['nullable', 'boolean'],
            'imageFileId' => ['nullable', 'integer', 'exists:uploaded_files,id'],
            'imageFileIds' => ['nullable', 'array', 'max:10'],
            'imageFileIds.*' => ['integer', 'exists:uploaded_files,id'],
        ];
    }
}
