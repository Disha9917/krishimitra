<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransportBookingRequest extends FormRequest
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
            'quantityKg' => ['required', 'numeric', 'gt:0'],
            'distanceKm' => ['required', 'numeric', 'gt:0'],
            'pickupLocation' => ['nullable', 'string', 'max:255'],
            'dropoffLocation' => ['nullable', 'string', 'max:255'],
            'pickupAt' => ['required', 'date_format:Y-m-d H:i'],
            'dropoffAt' => ['required', 'date_format:Y-m-d H:i', 'after:pickupAt'],
            'loadingCharges' => ['nullable', 'numeric', 'gte:0'],
            'tollCharges' => ['nullable', 'numeric', 'gte:0'],
            'fuelRatePerLitre' => ['nullable', 'numeric', 'gt:0'],
        ];
    }
}
