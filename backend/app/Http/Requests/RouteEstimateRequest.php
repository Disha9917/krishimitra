<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RouteEstimateRequest extends FormRequest
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
            'origin' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'originLat' => ['nullable', 'numeric', 'between:-90,90'],
            'originLng' => ['nullable', 'numeric', 'between:-180,180'],
            'destinationLat' => ['nullable', 'numeric', 'between:-90,90'],
            'destinationLng' => ['nullable', 'numeric', 'between:-180,180'],
            'distanceKm' => ['nullable', 'numeric', 'gt:0'],
        ];
    }
}
