<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\SoilHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SoilHistory */
class SoilHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $parameters = (array) ($this->parameters_json ?? []);

        return [
            'id' => (int) $this->id,
            'soilTestId' => $this->soil_test_id !== null ? (int) $this->soil_test_id : null,
            'field' => $this->field !== null ? [
                'id' => (int) $this->field->id,
                'name' => $this->field->name,
            ] : null,
            'crop' => $this->soilTest?->crop !== null ? [
                'id' => (int) $this->soilTest->crop->id,
                'name' => $this->soilTest->crop->name,
            ] : null,
            'sampledOn' => $this->sampled_on?->toDateString(),
            'parameters' => $this->normalizedParameters($parameters),
            'healthScore' => isset($parameters['health_score']) ? (float) $parameters['health_score'] : null,
            'soilStatus' => $parameters['soil_status'] ?? null,
            'fertilityLevel' => $parameters['fertility_level'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $parameters
     * @return array<string, mixed>
     */
    private function normalizedParameters(array $parameters): array
    {
        $numeric = [
            'ph',
            'ec',
            'nitrogen_kg_ha',
            'phosphorus_kg_ha',
            'potassium_kg_ha',
            'organic_carbon_pct',
            'moisture_pct',
        ];

        $normalized = [];

        foreach ($parameters as $key => $value) {
            if (in_array($key, $numeric, true) && is_numeric($value)) {
                $normalized[$key] = (float) $value;
            } else {
                $normalized[$key] = $value;
            }
        }

        return $normalized;
    }
}
