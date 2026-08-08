<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Report
 */
class ReportResource extends JsonResource
{
    public function __construct(
        $resource,
        private readonly bool $withData = false,
    ) {
        parent::__construct($resource);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $formats = collect((array) $this->files)->pluck('format')->values()->all();
        $ready = $this->status === 'ready';

        return [
            'id' => (int) $this->id,
            'uuid' => (string) $this->uuid,
            'title' => (string) $this->title,
            'reportType' => (string) $this->report_type,
            'category' => (string) $this->category,
            'status' => (string) $this->status,
            'fileFormat' => (string) $this->file_format,
            'formats' => $formats,
            'filters' => (array) $this->filters,
            'data' => $this->withData && $ready ? (array) $this->data : null,
            'favorite' => (bool) $this->is_favorite,
            'fileSizeBytes' => $this->file_size_bytes !== null ? (int) $this->file_size_bytes : null,
            'fileSizeDisplay' => $this->file_size_display,
            'errorMessage' => $this->error_message,
            'generatedAt' => $this->generated_at?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),
            'downloadUrl' => $ready ? collect($formats)->mapWithKeys(
                fn (string $format): array => [$format => sprintf('/v1/reports/%d/download?format=%s', $this->id, $format)],
            )->all() : [],
        ];
    }
}
