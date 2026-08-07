<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Taluka;
use Illuminate\Database\Eloquent\Collection;

interface TalukaRepositoryInterface extends BaseRepositoryInterface
{

    public function talukasForDistrict(int $districtId): Collection;
}
