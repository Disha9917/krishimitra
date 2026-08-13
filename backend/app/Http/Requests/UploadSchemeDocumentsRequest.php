<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadSchemeDocumentsRequest extends FormRequest
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
            'documents' => ['required', 'array', 'min:1', 'max:10'],
            'documents.*' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:5120'],
        ];
    }
}
