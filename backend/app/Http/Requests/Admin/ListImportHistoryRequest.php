<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListImportHistoryRequest extends FormRequest
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
            'dataset_type' => ['nullable', 'string', Rule::in(array_keys(config('import.datasets')))],
            'status' => ['nullable', 'string', Rule::in(['pending', 'queued', 'processing', 'imported', 'partial', 'failed', 'rolled_back'])],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
