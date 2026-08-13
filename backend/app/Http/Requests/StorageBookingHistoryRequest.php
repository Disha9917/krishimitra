<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorageBookingHistoryRequest extends FormRequest
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
            'status' => ['sometimes', 'nullable', 'string', 'in:requested,approved,rejected,active,completed,cancelled,pending'],
            'storageId' => ['sometimes', 'nullable', 'integer', 'exists:cold_storages,id'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
