<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Wraps the validation report payload produced by ImportService.
 */
class ImportReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'datasetType' => $this['dataset_type'],
            'datasetLabel' => $this['dataset_label'],
            'fileName' => $this['file_name'],
            'headers' => $this['headers'],
            'missingHeaders' => $this['missing_headers'],
            'totalRows' => $this['total_rows'],
            'validRows' => $this['valid_rows'],
            'duplicateRows' => $this['duplicate_rows'],
            'existingRows' => $this['existing_rows'],
            'errorRows' => $this['error_rows'],
            'errors' => $this['errors'],
            'preview' => $this['preview'] ?? [],
            'rowStatuses' => $this['row_statuses'] ?? [],
        ];
    }
}
