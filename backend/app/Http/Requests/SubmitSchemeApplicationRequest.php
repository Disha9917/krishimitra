<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSchemeApplicationRequest extends FormRequest
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
            'documents' => ['sometimes', 'nullable', 'array', 'max:20'],
            'documents.*.fileId' => ['required_with:documents', 'integer', 'exists:uploaded_files,id'],
            'documents.*.type' => ['required_with:documents', 'string', 'max:50'],
        ];
    }
}
