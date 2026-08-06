<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\FarmerCrop;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FarmerCrop */
class FarmerCropResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'crop' => $this->crop !== null ? [
                'id' => (int) $this->crop->id,
                'name' => $this->crop->name,
                'nameGujarati' => $this->crop->name_gujarati,
            ] : null,
            'field' => $this->field !== null ? [
                'id' => (int) $this->field->id,
                'name' => $this->field->name,
            ] : null,
            'season' => $this->season,
            'sowingDate' => $this->sowing_date?->toDateString(),
            'expectedHarvestDate' => $this->expected_harvest_date?->toDateString(),
            'isCurrent' => (bool) $this->is_current,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
