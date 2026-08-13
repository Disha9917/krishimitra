<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\GovernmentScheme;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin GovernmentScheme */
class SchemeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'code' => $this->code,
            'title' => $this->title,
            'category' => $this->category,
            'description' => $this->description,
            'benefits' => $this->benefits ?? [],
            'eligibilityCriteria' => $this->eligibility_criteria ?? [],
            'documentsRequired' => $this->documents_required ?? [],
            'state' => $this->state,
            'deadline' => $this->deadline?->toDateString(),
            'applyUrl' => $this->apply_url,
            'officialLink' => $this->official_link,
            'isActive' => (bool) $this->is_active,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
