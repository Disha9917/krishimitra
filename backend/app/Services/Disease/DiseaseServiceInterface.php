<?php

declare(strict_types=1);

namespace App\Services\Disease;

use App\Models\Disease;
use App\Models\DiseaseDetection;
use App\Models\DiseaseHistory;
use App\Models\TreatmentRecommendation;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseServiceInterface
{
    /**
     * Persist a detection and append its history trail entry.
     */
    public function saveDetection(int $userId, array $data): DiseaseDetection;

    /**
     * Resolve the recommended treatment for a detected disease.
     */
    public function treatmentRecommendation(int $diseaseId): ?TreatmentRecommendation;

    /**
     * Diseases with recent detection activity.
     */
    public function recentDetections(int $limit = 10): Collection;

    /**
     * A farmer's full disease history trail.
     */
    public function diseaseHistory(int $userId): Collection;

    /**
     * Mark a history entry resolved with outcome notes.
     */
    public function markResolved(int $historyId, array $outcome): ?DiseaseHistory;

    /**
     * Look up a disease by its identifier.
     */
    public function findDisease(int $diseaseId): ?Disease;
}
