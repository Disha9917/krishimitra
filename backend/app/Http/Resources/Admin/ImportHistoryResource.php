<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\ImportHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ImportHistory
 */
class ImportHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $processed = $this->imported_rows + $this->updated_rows + $this->skipped_rows + $this->failed_rows;

        return [
            'id' => (int) $this->id,
            'uuid' => (string) $this->uuid,
            'datasetType' => (string) $this->dataset_type,
            'fileName' => (string) $this->file_name,
            'status' => (string) $this->status,
            'totalRows' => (int) $this->total_rows,
            'validRows' => (int) $this->valid_rows,
            'duplicateRows' => (int) $this->duplicate_rows,
            'existingRows' => (int) $this->existing_rows,
            'errorRows' => (int) $this->error_rows,
            'importedRows' => (int) $this->imported_rows,
            'updatedRows' => (int) $this->updated_rows,
            'skippedRows' => (int) $this->skipped_rows,
            'failedRows' => (int) $this->failed_rows,
            'processedRows' => $processed,
            'progressPercent' => $this->total_rows > 0 ? round(($processed / $this->total_rows) * 100, 1) : 0,
            'errorMessage' => $this->error_message,
            'startedAt' => $this->started_at?->toISOString(),
            'finishedAt' => $this->finished_at?->toISOString(),
            'durationMs' => $this->duration_ms,
            'uploadedBy' => (int) $this->uploaded_by,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
