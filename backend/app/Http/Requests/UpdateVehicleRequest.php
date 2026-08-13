<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
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
            'vehicleTypeId' => ['sometimes', 'required', 'integer', 'exists:transport_vehicle_types,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'vehicleNumber' => ['nullable', 'string', 'max:30'],
            'capacityKg' => ['sometimes', 'required', 'numeric', 'gt:0'],
            'pricePerKm' => ['sometimes', 'required', 'numeric', 'gt:0'],
            'loadingCharges' => ['nullable', 'numeric', 'gte:0'],
            'driverName' => ['nullable', 'string', 'max:100'],
            'driverPhone' => ['nullable', 'string', 'max:15'],
            'contactPhone' => ['nullable', 'string', 'max:15'],
            'pincode' => ['nullable', 'string', 'digits:6'],
            'districtId' => ['nullable', 'integer', 'exists:districts,id'],
            'talukaId' => ['nullable', 'integer', 'exists:talukas,id'],
            'villageId' => ['nullable', 'integer', 'exists:villages,id'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'serviceAreas' => ['nullable', 'array', 'max:50'],
            'serviceAreas.*' => ['string', 'max:150'],
            'isAvailable' => ['nullable', 'boolean'],
            'imageFileId' => ['nullable', 'integer', 'exists:uploaded_files,id'],
            'imageFileIds' => ['nullable', 'array', 'max:10'],
            'imageFileIds.*' => ['integer', 'exists:uploaded_files,id'],
        ];
    }
}
