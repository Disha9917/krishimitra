<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SoilRecommendationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'testId' => $this['test_id'],
            'generatedAt' => $this['generated_at'],
            'fertilizer' => $this->fertilizer($this['fertilizer']),
            'limeRequirement' => [
                'required' => $this['lime_requirement']['required'],
                'tonsPerHectare' => $this['lime_requirement']['tons_per_hectare'],
                'message' => $this['lime_requirement']['message'],
            ],
            'organicMatter' => [
                'level' => $this['organic_matter']['level'],
                'recommendation' => $this['organic_matter']['recommendation'],
            ],
            'irrigation' => [
                'suggestion' => $this['irrigation']['suggestion'],
                'frequency' => $this['irrigation']['frequency'],
                'irrigateNow' => $this['irrigation']['irrigate_now'],
            ],
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $items
     * @return list<array<string, mixed>>
     */
    private function fertilizer(array $items): array
    {
        return array_map(function (array $item): array {
            return [
                'nutrient' => $item['nutrient'],
                'band' => $item['band'],
                'dosage' => $item['dosage'],
                'suggestedKgPerHa' => $item['suggested_kg_per_ha'],
            ];
        }, $items);
    }
}
