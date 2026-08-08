<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface DiseaseImageRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Every image attached to a detection (primary first).
     */
    public function imagesForDetection(int $detectionId): Collection;

    /**
     * Whether a file is already attached to a detection.
     */
    public function fileAttached(int $detectionId, int $fileId): bool;
}
