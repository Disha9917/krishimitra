<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiseaseTreatmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'detectionId' => $this['detection_id'],
            'diseaseName' => $this['disease_name'],
            'severity' => $this['severity'],
            'source' => $this['source'],
            'recommendedTreatment' => $this['recommended_treatment'],
            'organicTreatments' => $this['organic_treatments'],
            'chemicalTreatments' => $this['chemical_treatments'],
            'preventionTips' => $this['prevention_tips'],
            'followUpAdvice' => $this['follow_up_advice'],
        ];
    }
}
