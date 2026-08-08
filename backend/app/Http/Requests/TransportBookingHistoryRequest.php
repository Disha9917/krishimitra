<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransportBookingHistoryRequest extends FormRequest
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
            'status' => ['nullable', 'string', 'in:requested,approved,rejected,cancelled,completed'],
            'vehicleId' => ['nullable', 'integer', 'exists:vehicles,id'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
