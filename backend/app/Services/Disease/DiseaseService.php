<?php

declare(strict_types=1);

namespace App\Services\Disease;

use App\Models\Disease;
use App\Models\DiseaseDetection;
use App\Models\DiseaseHistory;
use App\Models\TreatmentRecommendation;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use App\Repositories\Contracts\DiseaseHistoryRepositoryInterface;
use App\Repositories\Contracts\DiseaseRepositoryInterface;
use App\Repositories\Contracts\TreatmentRecommendationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class DiseaseService implements DiseaseServiceInterface
{
    public function __construct(
        private readonly DiseaseRepositoryInterface $diseases,
        private readonly DiseaseDetectionRepositoryInterface $detections,
        private readonly DiseaseHistoryRepositoryInterface $history,
        private readonly TreatmentRecommendationRepositoryInterface $treatments,
    ) {
    }

    public function saveDetection(int $userId, array $data): DiseaseDetection
    {
        $detection = $this->detections->create([
            'user_id' => $userId,
            'detected_at' => $data['detected_at'] ?? now(),
            ...$this->detectionAttributes($data),
        ]);

        $this->history->create([
            'detection_id' => (int) $detection->id,
            'user_id' => $userId,
            'field_id' => $data['field_id'] ?? null,
            'crop_id' => $data['crop_id'] ?? $detection->crop_id,
            'disease_id' => $data['disease_id'] ?? $detection->disease_id,
            'resolved' => false,
            'recurrence_count' => 0,
        ]);

        return $detection;
    }

    public function treatmentRecommendation(int $diseaseId): ?TreatmentRecommendation
    {
        return $this->treatments->recommendationsForDisease($diseaseId)->first();
    }

    public function recentDetections(int $limit = 10): Collection
    {
        return $this->diseases->recentDetections($limit);
    }

    public function diseaseHistory(int $userId): Collection
    {
        return $this->history->findWhere(['user_id' => $userId]);
    }

    public function markResolved(int $historyId, array $outcome): ?DiseaseHistory
    {
        $entry = $this->history->findById($historyId);

        if ($entry === null) {
            return null;
        }

        return $this->history->update($historyId, [
            'resolved' => (bool) ($outcome['resolved'] ?? true),
            'treatment_applied' => $outcome['treatment_applied'] ?? null,
            'outcome_notes' => $outcome['outcome_notes'] ?? null,
            'recurrence_count' => (int) ($outcome['recurrence_count'] ?? $entry->recurrence_count),
        ]);
    }

    public function findDisease(int $diseaseId): ?Disease
    {
        return $this->diseases->findById($diseaseId);
    }

    /**
     * @return array<string, mixed>
     */
    private function detectionAttributes(array $data): array
    {
        $allowed = [
            'crop_id',
            'disease_id',
            'disease_name',
            'scientific_name',
            'confidence',
            'confidence_score',
            'severity',
            'treatment_snapshot',
            'model_version',
        ];

        return array_intersect_key($data, array_flip($allowed));
    }
}
