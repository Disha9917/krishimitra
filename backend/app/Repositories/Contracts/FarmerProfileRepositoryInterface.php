<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\FarmerProfile;

interface FarmerProfileRepositoryInterface extends BaseRepositoryInterface
{

    public function farmerDashboard(int $userId): ?FarmerProfile;
}
