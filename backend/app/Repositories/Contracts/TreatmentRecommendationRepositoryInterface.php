<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TreatmentRecommendation;
use Illuminate\Database\Eloquent\Collection;

interface TreatmentRecommendationRepositoryInterface extends BaseRepositoryInterface
{

    public function recommendationsForDisease(int $diseaseId): Collection;
}
