<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\FarmerCrop;
use Illuminate\Database\Eloquent\Collection;

interface FarmerCropRepositoryInterface extends BaseRepositoryInterface
{

    public function cropsForUser(int $userId): Collection;

    public function cropsForField(int $fieldId): Collection;
}
