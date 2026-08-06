<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use App\Repositories\Contracts\MarketPriceRepositoryInterface;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Services\Common\DTO\DashboardOverviewDTO;

class DashboardService implements DashboardServiceInterface
{
    public function __construct(
        private readonly FarmerProfileRepositoryInterface $profiles,
        private readonly FarmerFieldRepositoryInterface $fields,
        private readonly FarmerCropRepositoryInterface $farmerCrops,
        private readonly HarvestRepositoryInterface $harvests,
        private readonly DiseaseDetectionRepositoryInterface $detections,
        private readonly NotificationRepositoryInterface $notifications,
        private readonly MarketPriceRepositoryInterface $prices,
        private readonly AiAdvisoryRepositoryInterface $advisories,
    ) {
    }

    public function dashboardOverview(int $userId): DashboardOverviewDTO
    {
        $harvests = $this->harvests->harvestsForFarmer($userId);

        return DashboardOverviewDTO::assemble(
            profile: $this->profiles->farmerDashboard($userId),
            fieldCount: $this->fields->linkedFields($userId)->count(),
            cropCount: $this->farmerCrops->cropsForUser($userId)->count(),
            unreadCount: $this->notifications->unreadCount($userId),
            totalHarvestKg: (float) $harvests->sum('quantity_kg'),
            latestPrices: $this->prices->latestPrices(null, null, 5),
            recentAdvisories: $this->advisories->advisoriesForUser($userId)->take(3)->values(),
            recentDetections: $this->detections->detectionsForFarmer($userId)->take(3)->values(),
        );
    }

    public function statistics(int $userId): array
    {
        $harvests = $this->harvests->harvestsForFarmer($userId);
        $yields = $harvests->map(fn ($harvest) => $harvest->yield_per_acre)
            ->filter()
            ->values();

        return [
            'user_id' => $userId,
            'total_fields' => $this->fields->linkedFields($userId)->count(),
            'total_crops' => $this->farmerCrops->cropsForUser($userId)->count(),
            'total_harvests' => $harvests->count(),
            'total_harvest_kg' => (float) $harvests->sum('quantity_kg'),
            'average_yield_per_acre' => $yields->avg(),
            'total_detections' => $this->detections->detectionsForFarmer($userId)->count(),
            'total_advisories' => $this->advisories->advisoriesForUser($userId)->count(),
            'unread_notifications' => $this->notifications->unreadCount($userId),
        ];
    }
}
