<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\ImportLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ImportLog
 */
class ImportLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'importId' => (int) $this->import_id,
            'rowNumber' => (int) $this->row_number,
            'action' => (string) $this->action,
            'entityKey' => $this->entity_key,
            'message' => $this->message,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
