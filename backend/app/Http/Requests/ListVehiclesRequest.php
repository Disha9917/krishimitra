<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListVehiclesRequest extends FormRequest
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
            'districtId' => ['nullable', 'integer', 'exists:districts,id'],
            'talukaId' => ['nullable', 'integer', 'exists:talukas,id'],
            'vehicleTypeId' => ['nullable', 'integer', 'exists:transport_vehicle_types,id'],
            'minCapacityKg' => ['nullable', 'numeric', 'gt:0'],
            'maxCapacityKg' => ['nullable', 'numeric', 'gt:0'],
            'isAvailable' => ['nullable', 'boolean'],
            'minPrice' => ['nullable', 'numeric', 'gt:0'],
            'maxPrice' => ['nullable', 'numeric', 'gt:0'],
            'search' => ['nullable', 'string', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
