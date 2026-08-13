<?php

declare(strict_types=1);

namespace App\Services\Disease;

use App\Models\Disease;
use App\Models\DiseaseDetection;
use App\Models\DiseaseHistory;
use App\Models\TreatmentRecommendation;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use App\Repositories\Contracts\DiseaseHistoryRepositoryInterface;
use App\Repositories\Contracts\DiseaseImageRepositoryInterface;
use App\Repositories\Contracts\DiseaseRepositoryInterface;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\TreatmentRecommendationRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Throwable;

class DiseaseService implements DiseaseServiceInterface
{
    /**
     * @var array<string, int>
     */
    private const SEVERITY_DISTRIBUTION = [
        'low' => 0,
        'medium' => 0,
        'high' => 0,
        'critical' => 0,
    ];

    /**
     * @var array<string, int>
     */
    private const STATUS_DISTRIBUTION = [
        'pending' => 0,
        'confirmed' => 0,
        'treated' => 0,
        'dismissed' => 0,
    ];

    /**
     * @var array<string, int>
     */
    private const SOURCE_DISTRIBUTION = [
        'manual' => 0,
        'ai' => 0,
    ];

    /**
     * Keys on disease_detections writable through the service.
     *
     * @var list<string>
     */
    private const WRITABLE_ATTRIBUTES = [
        'crop_id',
        'disease_id',
        'disease_name',
        'scientific_name',
        'description',
        'symptoms',
        'confidence',
        'confidence_score',
        'severity',
        'detection_source',
        'detection_status',
        'treatment_snapshot',
        'model_version',
        'detected_at',
    ];

    public function __construct(
        private readonly DiseaseRepositoryInterface $diseases,
        private readonly DiseaseDetectionRepositoryInterface $detections,
        private readonly DiseaseHistoryRepositoryInterface $history,
        private readonly DiseaseImageRepositoryInterface $images,
        private readonly TreatmentRecommendationRepositoryInterface $treatments,
        private readonly FarmerFieldRepositoryInterface $fields,
        private readonly UploadedFileRepositoryInterface $files,
    ) {}

    public function saveDetection(int $userId, array $data): DiseaseDetection
    {
        $fieldId = isset($data['field_id']) ? (int) $data['field_id'] : null;

        if ($fieldId !== null) {
            $this->assertFieldOwnership($userId, $fieldId);
        }

        $detection = $this->detections->create([
            'user_id' => $userId,
            'field_id' => $fieldId,
            'detected_at' => $data['detected_at'] ?? now(),
            ...$this->detectionAttributes($data),
        ]);

        $this->history->create([
            'detection_id' => (int) $detection->id,
            'user_id' => $userId,
            'field_id' => $fieldId,
            'crop_id' => $data['crop_id'] ?? $detection->crop_id,
            'disease_id' => $data['disease_id'] ?? $detection->disease_id,
            'resolved' => false,
            'recurrence_count' => 0,
        ]);

        return $detection;
    }

    public function createDetection(int $userId, int $fieldId, int $cropId, array $data): DiseaseDetection
    {
        $this->assertFieldOwnership($userId, $fieldId);

        $severity = (string) ($data['severity'] ?? 'medium');
        $confidenceScore = (float) ($data['confidence_score'] ?? 0);

        $detection = $this->detections->create([
            'user_id' => $userId,
            'field_id' => $fieldId,
            'crop_id' => $cropId,
            'disease_id' => $data['disease_id'] ?? null,
            'disease_name' => (string) $data['disease_name'],
            'scientific_name' => $data['scientific_name'] ?? null,
            'description' => $data['description'] ?? null,
            'symptoms' => $data['symptoms'] ?? [],
            'confidence' => $data['confidence'] ?? $this->confidenceLabel($confidenceScore),
            'confidence_score' => $confidenceScore,
            'severity' => $severity,
            'detection_source' => $data['detection_source'] ?? 'manual',
            'detection_status' => $data['detection_status'] ?? 'confirmed',
            'treatment_snapshot' => $data['treatment_snapshot']
                ?? $this->buildTreatmentSnapshot($data['disease_id'] ?? null, $severity),
            'model_version' => $data['model_version'] ?? null,
            'detected_at' => $data['detected_at'] ?? now(),
        ]);

        $this->history->create([
            'detection_id' => (int) $detection->id,
            'user_id' => $userId,
            'field_id' => $fieldId,
            'crop_id' => $cropId,
            'disease_id' => $detection->disease_id,
            'resolved' => false,
            'recurrence_count' => 0,
        ]);

        if (isset($data['image_file_ids']) && is_array($data['image_file_ids']) && $data['image_file_ids'] !== []) {
            $this->linkImages($userId, (int) $detection->id, $data['image_file_ids']);
        }

        return $detection;
    }

    public function getDetection(int $userId, int $detectionId): ?DiseaseDetection
    {
        return $this->detections->findForFarmer($userId, $detectionId);
    }

    public function updateDetection(int $userId, int $detectionId, array $data): ?DiseaseDetection
    {
        $detection = $this->detections->findForFarmer($userId, $detectionId);

        if ($detection === null) {
            return null;
        }

        return $this->detections->update($detectionId, $this->detectionAttributes($data));
    }

    public function deleteDetection(int $userId, int $detectionId): bool
    {
        $detection = $this->detections->findForFarmer($userId, $detectionId);

        if ($detection === null) {
            return false;
        }

        return $this->detections->delete($detectionId);
    }

    public function listDetections(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->detections->listForFarmer($userId, $filters, $limit);
    }

    public function detectionHistory(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->history->historyForFarmer($userId, $filters, $limit);
    }

    public function diseaseDashboard(int $userId): array
    {
        $detections = $this->detections->listForFarmer($userId, [], 1000);
        $history = $this->history->historyForFarmer($userId, [], 1000);

        $severityDistribution = self::SEVERITY_DISTRIBUTION;
        $statusDistribution = self::STATUS_DISTRIBUTION;
        $sourceDistribution = self::SOURCE_DISTRIBUTION;

        foreach ($detections as $detection) {
            if (is_string($detection->severity) && array_key_exists($detection->severity, $severityDistribution)) {
                $severityDistribution[$detection->severity]++;
            }

            if (is_string($detection->detection_status) && array_key_exists($detection->detection_status, $statusDistribution)) {
                $statusDistribution[$detection->detection_status]++;
            }

            if (is_string($detection->detection_source) && array_key_exists($detection->detection_source, $sourceDistribution)) {
                $sourceDistribution[$detection->detection_source]++;
            }
        }

        $thisMonth = $detections
            ->filter(fn (DiseaseDetection $detection): bool => $detection->detected_at !== null
                && $detection->detected_at->isSameMonth(now(), true))
            ->count();

        $diseaseDistribution = $detections
            ->groupBy('disease_name')
            ->map(fn (Collection $group): int => $group->count())
            ->sortDesc()
            ->take(10);

        return [
            'recent_detections' => $detections->take(5)->values(),
            'high_severity_cases' => $detections
                ->filter(fn (DiseaseDetection $detection): bool => in_array($detection->severity, ['high', 'critical'], true))
                ->take(5)
                ->values(),
            'statistics' => [
                'total_detections' => $detections->count(),
                'detections_this_month' => $thisMonth,
                'active_cases' => $detections
                    ->filter(fn (DiseaseDetection $detection): bool => in_array($detection->detection_status, ['pending', 'confirmed'], true))
                    ->count(),
                'resolved_cases' => $history->where('resolved', true)->count(),
                'fields_affected' => $detections->pluck('field_id')->filter()->unique()->count(),
                'severity_distribution' => $severityDistribution,
                'status_distribution' => $statusDistribution,
                'source_distribution' => $sourceDistribution,
            ],
            'disease_distribution' => $diseaseDistribution,
        ];
    }

    public function treatmentForDetection(int $userId, int $detectionId): ?array
    {
        $detection = $this->detections->findForFarmer($userId, $detectionId);

        if ($detection === null) {
            return null;
        }

        $snapshot = (array) ($detection->treatment_snapshot ?? []);

        if ($snapshot === []) {
            $snapshot = $this->buildTreatmentSnapshot(
                $detection->disease_id !== null ? (int) $detection->disease_id : null,
                is_string($detection->severity) ? $detection->severity : 'medium',
            );
            $source = 'knowledge_base';
        } else {
            $source = 'detection_snapshot';
        }

        return [
            'detection_id' => (int) $detection->id,
            'disease_name' => $detection->disease_name,
            'severity' => $detection->severity,
            'source' => $source,
            'recommended_treatment' => $snapshot['recommended_treatment'] ?? null,
            'organic_treatments' => $snapshot['organic_treatments'] ?? [],
            'chemical_treatments' => $snapshot['chemical_treatments'] ?? [],
            'prevention_tips' => $snapshot['prevention_tips'] ?? [],
            'follow_up_advice' => $snapshot['follow_up_advice'] ?? null,
        ];
    }

    public function uploadImages(int $userId, array $files): array
    {
        $stored = [];

        foreach ($files as $file) {
            $path = $file->store('disease-images/'.$userId, 'local');

            $stored[] = $this->files->create([
                'user_id' => $userId,
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size_bytes' => $file->getSize(),
                'sha256_hash' => hash_file('sha256', (string) $file->getRealPath()),
                'visibility' => 'private',
            ]);
        }

        return $stored;
    }

    public function attachImages(int $userId, int $detectionId, array $fileIds): ?DiseaseDetection
    {
        $detection = $this->detections->findForFarmer($userId, $detectionId);

        if ($detection === null) {
            return null;
        }

        $this->linkImages($userId, $detectionId, $fileIds);

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
     * @param  list<int>  $fileIds
     */
    private function linkImages(int $userId, int $detectionId, array $fileIds): void
    {
        $hasPrimary = $this->images
            ->imagesForDetection($detectionId)
            ->where('is_primary', true)
            ->isNotEmpty();

        foreach ($fileIds as $fileId) {
            $file = $this->files->findForUser($userId, (int) $fileId);

            if ($file === null || $this->images->fileAttached($detectionId, (int) $fileId)) {
                continue;
            }

            $dimensions = $this->imageDimensions($file->disk, $file->path);

            $this->images->create([
                'detection_id' => $detectionId,
                'file_id' => (int) $fileId,
                'is_primary' => ! $hasPrimary,
                'width' => $dimensions['width'],
                'height' => $dimensions['height'],
                'size_bytes' => $file->size_bytes,
            ]);

            $hasPrimary = true;
        }
    }

    /**
     * @return array{width: int|null, height: int|null}
     */
    private function imageDimensions(?string $disk, string $path): array
    {
        try {
            $fullPath = Storage::disk($disk ?? 'local')->path($path);

            if (is_file($fullPath)) {
                $size = @getimagesize($fullPath);

                if (is_array($size)) {
                    return ['width' => (int) $size[0], 'height' => (int) $size[1]];
                }
            }
        } catch (Throwable) {
            // Dimensions are best-effort metadata; never fail the attach.
        }

        return ['width' => null, 'height' => null];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildTreatmentSnapshot(?int $diseaseId, string $severity): array
    {
        if ($diseaseId === null) {
            return $this->defaultTreatment($severity);
        }

        $disease = $this->diseases->findById($diseaseId);
        $knowledgeBase = $this->treatments->recommendationsForDisease($diseaseId);
        $treatment = $knowledgeBase->firstWhere('severity', $severity) ?? $knowledgeBase->first();

        $recommended = $treatment?->recommended_product ?? $disease?->recommended_product ?? null;
        $dosage = $treatment?->dosage ?? $disease?->dosage ?? null;

        return [
            'recommended_treatment' => $recommended !== null
                ? ($dosage !== null ? sprintf('%s — %s', $recommended, $dosage) : $recommended)
                : $this->defaultTreatment($severity)['recommended_treatment'],
            'organic_treatments' => $treatment?->organic_treatments ?? $disease?->organic_treatments ?? [],
            'chemical_treatments' => $treatment?->chemical_treatments ?? $disease?->chemical_treatments ?? [],
            'prevention_tips' => $disease?->preventive_measures ?? [],
            'follow_up_advice' => $this->followUpAdvice($severity),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultTreatment(string $severity): array
    {
        return [
            'recommended_treatment' => 'Consult a local agricultural extension officer or Krishi Vigyan Kendra for confirmed treatment guidance.',
            'organic_treatments' => [],
            'chemical_treatments' => [],
            'prevention_tips' => [],
            'follow_up_advice' => $this->followUpAdvice($severity),
        ];
    }

    private function followUpAdvice(string $severity): string
    {
        return match ($severity) {
            'critical' => 'Re-inspect the affected plants every 24–48 hours. Isolate severely infected plants, apply the treatment immediately, and contact your agricultural extension officer without delay.',
            'high' => 'Monitor the crop every 2–3 days. Re-apply the recommended treatment after the advised interval and keep the field free of infected plant debris.',
            'low' => 'Re-inspect the crop weekly. If symptoms spread or worsen, upgrade to the next treatment tier and contact your local Krishi Vigyan Kendra.',
            default => 'Monitor the crop weekly. If symptoms persist beyond 7–10 days, revisit the recommendation and consult an agricultural expert.',
        };
    }

    private function confidenceLabel(float $score): string
    {
        if ($score >= 80.0) {
            return 'High';
        }

        if ($score >= 50.0) {
            return 'Medium';
        }

        return 'Low';
    }

    /**
     * @return array<string, mixed>
     */
    private function detectionAttributes(array $data): array
    {
        $attributes = array_intersect_key($data, array_flip(self::WRITABLE_ATTRIBUTES));

        if (isset($data['confidence_score']) && ! isset($data['confidence'])) {
            $attributes['confidence'] = $this->confidenceLabel((float) $data['confidence_score']);
        }

        return $attributes;
    }

    private function assertFieldOwnership(int $userId, int $fieldId): void
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }
    }
}
