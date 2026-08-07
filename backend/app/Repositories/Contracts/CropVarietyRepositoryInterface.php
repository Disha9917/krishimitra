<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\CropVariety;
use Illuminate\Database\Eloquent\Collection;

interface CropVarietyRepositoryInterface extends BaseRepositoryInterface
{

    public function varietiesForCrop(int $cropId): Collection;
}
