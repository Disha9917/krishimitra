<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DiseaseDetection;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseDetectionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Every detection belonging to a farmer, newest first.
     */
    public function detectionsForFarmer(int $userId): Collection;

    /**
     * Find a detection belonging to a specific farmer.
     */
    public function findForFarmer(int $userId, int $detectionId): ?DiseaseDetection;

    /**
     * List a farmer's detections applying field/crop/severity/status/date filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listForFarmer(int $userId, array $filters = [], int $limit = 20): Collection;
}
