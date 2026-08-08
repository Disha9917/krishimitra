<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SoilDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'latestReport' => $this['latest_report'] !== null
                ? new SoilTestResource($this['latest_report'])
                : null,
            'averageHealthScore' => $this['average_health_score'],
            'statusDistribution' => $this['status_distribution'],
            'nutrientCharts' => $this['nutrient_charts'],
            'alerts' => $this['alerts'],
            'testsCount' => $this['tests_count'],
            'fieldsCount' => $this['fields_count'],
        ];
    }
}
