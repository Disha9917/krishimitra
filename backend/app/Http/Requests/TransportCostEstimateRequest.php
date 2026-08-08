<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransportCostEstimateRequest extends FormRequest
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
            'vehicleId' => ['required', 'integer', 'exists:vehicles,id'],
            'distanceKm' => ['required', 'numeric', 'gt:0'],
            'quantityKg' => ['required', 'numeric', 'gt:0'],
            'loadingCharges' => ['nullable', 'numeric', 'gte:0'],
            'tollCharges' => ['nullable', 'numeric', 'gte:0'],
            'fuelRatePerLitre' => ['nullable', 'numeric', 'gt:0'],
        ];
    }
}
