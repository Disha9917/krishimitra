<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListMandisRequest extends FormRequest
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
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
