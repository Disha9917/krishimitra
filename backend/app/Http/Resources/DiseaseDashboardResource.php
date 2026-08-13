<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiseaseDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'recentDetections' => DiseaseDetectionResource::collection($this['recent_detections']),
            'highSeverityCases' => DiseaseDetectionResource::collection($this['high_severity_cases']),
            'statistics' => [
                'totalDetections' => $this['statistics']['total_detections'],
                'detectionsThisMonth' => $this['statistics']['detections_this_month'],
                'activeCases' => $this['statistics']['active_cases'],
                'resolvedCases' => $this['statistics']['resolved_cases'],
                'fieldsAffected' => $this['statistics']['fields_affected'],
                'severityDistribution' => $this['statistics']['severity_distribution'],
                'statusDistribution' => $this['statistics']['status_distribution'],
                'sourceDistribution' => $this['statistics']['source_distribution'],
            ],
            'diseaseDistribution' => $this['disease_distribution'],
        ];
    }
}
