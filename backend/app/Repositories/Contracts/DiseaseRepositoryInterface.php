<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Disease;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseRepositoryInterface extends BaseRepositoryInterface
{

    public function recentDetections(int $limit = 10): Collection;

    public function diseaseHistory(?int $cropId = null, int $limit = 30): Collection;
}
