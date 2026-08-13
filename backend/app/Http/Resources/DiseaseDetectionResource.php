<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\DiseaseDetection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DiseaseDetection */
class DiseaseDetectionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'field' => $this->field !== null ? [
                'id' => (int) $this->field->id,
                'name' => $this->field->name,
            ] : null,
            'crop' => $this->crop !== null ? [
                'id' => (int) $this->crop->id,
                'name' => $this->crop->name,
                'nameGujarati' => $this->crop->name_gujarati,
            ] : null,
            'diseaseId' => $this->disease_id !== null ? (int) $this->disease_id : null,
            'diseaseName' => $this->disease_name,
            'scientificName' => $this->scientific_name,
            'description' => $this->description,
            'symptoms' => $this->symptoms ?? [],
            'confidence' => $this->confidence,
            'confidenceScore' => $this->confidence_score !== null ? (float) $this->confidence_score : null,
            'severity' => $this->severity,
            'detectionSource' => $this->detection_source,
            'detectionStatus' => $this->detection_status,
            'treatment' => $this->treatment_snapshot ?? [],
            'modelVersion' => $this->model_version,
            'images' => DiseaseImageResource::collection($this->images),
            'detectedAt' => $this->detected_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
