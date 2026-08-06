<?php

declare(strict_types=1);

namespace App\Services\Common\DTO;

use App\Models\AiAdvisory;
use App\Models\DiseaseDetection;
use App\Models\FarmerProfile;
use App\Models\MarketPrice;
use Illuminate\Database\Eloquent\Collection;

/**
 * Immutable aggregate prepared for the landing dashboard.
 */
final readonly class DashboardOverviewDTO
{
    public function __construct(
        public ?FarmerProfile $profile,
        public int $fieldCount,
        public int $cropCount,
        public int $unreadCount,
        public float $totalHarvestKg,
        public Collection $latestPrices,
        public Collection $recentAdvisories,
        public Collection $recentDetections,
    ) {
    }

    /**
     * @param  Collection<int, MarketPrice>  $latestPrices
     * @param  Collection<int, AiAdvisory>  $recentAdvisories
     * @param  Collection<int, DiseaseDetection>  $recentDetections
     */
    public static function assemble(
        ?FarmerProfile $profile,
        int $fieldCount,
        int $cropCount,
        int $unreadCount,
        float $totalHarvestKg,
        Collection $latestPrices,
        Collection $recentAdvisories,
        Collection $recentDetections,
    ): self {
        return new self(
            profile: $profile,
            fieldCount: $fieldCount,
            cropCount: $cropCount,
            unreadCount: $unreadCount,
            totalHarvestKg: $totalHarvestKg,
            latestPrices: $latestPrices,
            recentAdvisories: $recentAdvisories,
            recentDetections: $recentDetections,
        );
    }
}
