<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DiseaseImage;
use App\Repositories\Contracts\DiseaseImageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDiseaseImageRepository extends BaseEloquentRepository implements DiseaseImageRepositoryInterface
{
    public function __construct(DiseaseImage $model)
    {
        parent::__construct($model);
    }

    public function imagesForDetection(int $detectionId): Collection
    {
        return $this->model
            ->where('detection_id', $detectionId)
            ->orderByDesc('is_primary')
            ->orderBy('id')
            ->get();
    }

    public function fileAttached(int $detectionId, int $fileId): bool
    {
        return $this->model
            ->where('detection_id', $detectionId)
            ->where('file_id', $fileId)
            ->exists();
    }
}
