<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
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
            'equipmentType' => ['required', 'string', 'in:tractor,harvester,tiller,planter,sprayer,pump,cultivator,trailer,generator,other'],
            'category' => ['nullable', 'string', 'in:tillage,harvesting,irrigation,spraying,transport,power,processing,other'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:2000'],
            'dailyRate' => ['required', 'numeric', 'min:1'],
            'hourlyRate' => ['nullable', 'numeric', 'min:1'],
            'depositAmount' => ['nullable', 'numeric', 'min:0'],
            'pincode' => ['required', 'string', 'digits:6'],
            'districtId' => ['required', 'integer', 'exists:districts,id'],
            'talukaId' => ['nullable', 'integer', 'exists:talukas,id'],
            'villageId' => ['nullable', 'integer', 'exists:villages,id'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'isAvailable' => ['nullable', 'boolean'],
            'imageFileId' => ['nullable', 'integer', 'exists:uploaded_files,id'],
            'imageFileIds' => ['nullable', 'array', 'max:10'],
            'imageFileIds.*' => ['integer', 'exists:uploaded_files,id'],
        ];
    }
}
