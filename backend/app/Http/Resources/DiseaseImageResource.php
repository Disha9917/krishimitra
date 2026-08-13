<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\DiseaseImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin DiseaseImage */
class DiseaseImageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'fileId' => $this->file_id !== null ? (int) $this->file_id : null,
            'isPrimary' => (bool) $this->is_primary,
            'width' => $this->width,
            'height' => $this->height,
            'sizeBytes' => $this->size_bytes,
            'file' => $this->file !== null ? [
                'uuid' => $this->file->uuid,
                'url' => $this->file->disk !== null ? Storage::disk($this->file->disk)->url($this->file->path) : null,
                'originalName' => $this->file->original_name,
                'mimeType' => $this->file->mime_type,
                'sizeBytes' => $this->file->size_bytes,
            ] : null,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
