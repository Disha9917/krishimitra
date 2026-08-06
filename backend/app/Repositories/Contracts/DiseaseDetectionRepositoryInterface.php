<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DiseaseDetection;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseDetectionRepositoryInterface extends BaseRepositoryInterface
{

    public function detectionsForFarmer(int $userId): Collection;
}
