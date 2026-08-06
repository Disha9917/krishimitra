<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\PostHarvestAnalysis;
use Illuminate\Database\Eloquent\Collection;

interface PostHarvestAnalysisRepositoryInterface extends BaseRepositoryInterface
{

    public function analysesForUser(int $userId): Collection;
}
