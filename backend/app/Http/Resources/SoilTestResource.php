<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\SoilTest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SoilTest */
class SoilTestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'field' => $this->field !== null ? [
                'id' => (int) $this->field->id,
                'name' => $this->field->name,
            ] : null,
            'crop' => $this->crop !== null ? [
                'id' => (int) $this->crop->id,
                'name' => $this->crop->name,
                'nameGujarati' => $this->crop->name_gujarati,
            ] : null,
            'labName' => $this->lab_name,
            'reportDate' => $this->report_date?->toDateString(),
            'ph' => $this->ph !== null ? (float) $this->ph : null,
            'ec' => $this->ec !== null ? (float) $this->ec : null,
            'nitrogenKgHa' => $this->nitrogen_kg_ha !== null ? (float) $this->nitrogen_kg_ha : null,
            'phosphorusKgHa' => $this->phosphorus_kg_ha !== null ? (float) $this->phosphorus_kg_ha : null,
            'potassiumKgHa' => $this->potassium_kg_ha !== null ? (float) $this->potassium_kg_ha : null,
            'organicCarbonPct' => $this->organic_carbon_pct !== null ? (float) $this->organic_carbon_pct : null,
            'moisturePct' => $this->moisture_pct !== null ? (float) $this->moisture_pct : null,
            'micronutrients' => $this->micronutrients_json ?? [],
            'soilTexture' => $this->soil_texture,
            'soilType' => $this->soilType !== null ? [
                'id' => (int) $this->soilType->id,
                'name' => $this->soilType->name,
                'code' => $this->soilType->code,
            ] : null,
            'healthScore' => $this->health_score !== null ? (float) $this->health_score : null,
            'soilStatus' => $this->soil_status,
            'fertilityLevel' => $this->fertility_level,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
