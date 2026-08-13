<?php

declare(strict_types=1);

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class AdvisoryRequest extends FormRequest
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
            'topic' => ['required', 'string', 'max:500'],
            'advisory_type' => ['nullable', 'string', 'max:50'],
            'context' => ['nullable', 'array', 'max:50'],
            'locale' => ['nullable', 'string', 'in:en,gu'],
        ];
    }
}
