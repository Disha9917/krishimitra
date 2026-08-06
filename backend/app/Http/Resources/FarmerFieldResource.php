<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\FarmerField;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FarmerField */
class FarmerFieldResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'name' => $this->name,
            'sizeAcres' => $this->size_acres !== null ? (float) $this->size_acres : null,
            'soilType' => $this->soilType !== null ? [
                'id' => (int) $this->soilType->id,
                'name' => $this->soilType->name,
            ] : null,
            'currentCrop' => $this->currentCrop !== null ? [
                'id' => (int) $this->currentCrop->id,
                'name' => $this->currentCrop->name,
                'nameGujarati' => $this->currentCrop->name_gujarati,
            ] : null,
            'lat' => $this->lat !== null ? (float) $this->lat : null,
            'lng' => $this->lng !== null ? (float) $this->lng : null,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
