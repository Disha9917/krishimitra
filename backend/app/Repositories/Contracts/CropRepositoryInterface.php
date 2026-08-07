<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Crop;
use Illuminate\Database\Eloquent\Collection;

interface CropRepositoryInterface extends BaseRepositoryInterface
{

    public function activeCrops(): Collection;

    public function seasonalCrops(string $season): Collection;

    public function cropHistory(int $cropId, int $limit = 30): Collection;
}
