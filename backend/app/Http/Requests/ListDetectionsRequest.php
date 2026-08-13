<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListDetectionsRequest extends FormRequest
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
            'fieldId' => ['sometimes', 'nullable', 'integer', 'exists:farmer_fields,id'],
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'severity' => ['sometimes', 'nullable', 'string', 'in:low,medium,high,critical'],
            'status' => ['sometimes', 'nullable', 'string', 'in:pending,confirmed,treated,dismissed'],
            'from' => ['sometimes', 'nullable', 'date'],
            'to' => ['sometimes', 'nullable', 'date', 'after_or_equal:from'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
