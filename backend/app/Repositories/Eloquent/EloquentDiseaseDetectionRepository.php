<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DiseaseDetection;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDiseaseDetectionRepository extends BaseEloquentRepository implements DiseaseDetectionRepositoryInterface
{
    public function __construct(DiseaseDetection $model)
    {
        parent::__construct($model);
    }

    public function findForFarmer(int $userId, int $detectionId): ?DiseaseDetection
    {
        return $this->model
            ->where('id', $detectionId)
            ->where('user_id', $userId)
            ->first();
    }

    public function detectionsForFarmer(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('detected_at')
            ->get();
    }

    public function listForFarmer(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->when(isset($filters['field_id']) && $filters['field_id'] !== null, function ($query) use ($filters): void {
                $query->where('field_id', (int) $filters['field_id']);
            })
            ->when(isset($filters['crop_id']) && $filters['crop_id'] !== null, function ($query) use ($filters): void {
                $query->where('crop_id', (int) $filters['crop_id']);
            })
            ->when(isset($filters['severity']) && $filters['severity'] !== null, function ($query) use ($filters): void {
                $query->where('severity', $filters['severity']);
            })
            ->when(isset($filters['status']) && $filters['status'] !== null, function ($query) use ($filters): void {
                $query->where('detection_status', $filters['status']);
            })
            ->when(isset($filters['from']) && $filters['from'] !== null, function ($query) use ($filters): void {
                $query->where('detected_at', '>=', $filters['from']);
            })
            ->when(isset($filters['to']) && $filters['to'] !== null, function ($query) use ($filters): void {
                $query->where('detected_at', '<=', $filters['to']);
            })
            ->orderByDesc('detected_at')
            ->limit($limit)
            ->get();
    }
}
