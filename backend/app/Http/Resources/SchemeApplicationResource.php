<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\SchemeApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SchemeApplication */
class SchemeApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'scheme' => $this->scheme !== null ? [
                'id' => (int) $this->scheme->id,
                'code' => $this->scheme->code,
                'title' => $this->scheme->title,
                'category' => $this->scheme->category,
                'state' => $this->scheme->state,
                'deadline' => $this->scheme->deadline?->toDateString(),
            ] : null,
            'status' => $this->status,
            'documents' => $this->documents_json ?? [],
            'remarks' => $this->remarks,
            'submittedAt' => $this->submitted_at?->toIso8601String(),
            'decidedAt' => $this->decided_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
