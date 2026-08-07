<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\Services\Common\DTO\DashboardOverviewDTO;

interface DashboardServiceInterface
{
    /**
     * Aggregate the landing dashboard payload for a farmer.
     */
    public function dashboardOverview(int $userId): DashboardOverviewDTO;

    /**
     * Compute headline statistics for a farmer.
     *
     * @return array<string, mixed>
     */
    public function statistics(int $userId): array;
}
