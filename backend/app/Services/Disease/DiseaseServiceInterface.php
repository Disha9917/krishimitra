<?php

declare(strict_types=1);

namespace App\Services\Disease;

use App\Models\Disease;
use App\Models\DiseaseDetection;
use App\Models\DiseaseHistory;
use App\Models\TreatmentRecommendation;
use App\Models\UploadedFile;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseServiceInterface
{
    /**
     * Persist a detection and append its history trail entry.
     *
     * @throws \DomainException when the field does not belong to the user
     */
    public function saveDetection(int $userId, array $data): DiseaseDetection;

    /**
     * Persist a detection with its field/crop context, history trail entry and
     * optionally attached images.
     *
     * @param  list<int>  $imageFileIds  optional, passed inside $data
     *
     * @throws \DomainException when the field does not belong to the user
     */
    public function createDetection(int $userId, int $fieldId, int $cropId, array $data): DiseaseDetection;

    /**
     * Fetch a single detection owned by the farmer.
     */
    public function getDetection(int $userId, int $detectionId): ?DiseaseDetection;

    /**
     * Update an owned detection (history records are never overwritten).
     */
    public function updateDetection(int $userId, int $detectionId, array $data): ?DiseaseDetection;

    /**
     * Soft-delete an owned detection.
     */
    public function deleteDetection(int $userId, int $detectionId): bool;

    /**
     * List a farmer's detections with field/crop/severity/status/date filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listDetections(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * A farmer's append-only detection history trail with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function detectionHistory(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * Dashboard aggregates: recent detections, high-severity cases, statistics
     * and disease distribution.
     *
     * @return array<string, mixed>
     */
    public function diseaseDashboard(int $userId): array;

    /**
     * Treatment guidance for a detection: recommended/organic/chemical options,
     * prevention tips and follow-up advice.
     *
     * @return array<string, mixed>|null
     */
    public function treatmentForDetection(int $userId, int $detectionId): ?array;

    /**
     * Store uploaded crop images and register them as uploaded files.
     *
     * @param  list<\Illuminate\Http\UploadedFile>  $files
     * @return list<UploadedFile>
     */
    public function uploadImages(int $userId, array $files): array;

    /**
     * Attach previously uploaded images to an owned detection.
     *
     * @param  list<int>  $fileIds
     */
    public function attachImages(int $userId, int $detectionId, array $fileIds): ?DiseaseDetection;

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
