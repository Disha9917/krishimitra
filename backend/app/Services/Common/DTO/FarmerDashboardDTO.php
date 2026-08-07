<?php

declare(strict_types=1);

namespace App\Services\Common\DTO;

use App\Models\DiseaseDetection;
use App\Models\FarmerCrop;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\Harvest;
use Illuminate\Database\Eloquent\Collection;

/**
 * Immutable aggregate of a farmer's linked data for the farmer dashboard.
 */
final readonly class FarmerDashboardDTO
{
    public function __construct(
        public ?FarmerProfile $profile,
        public Collection $fields,
        public Collection $crops,
        public Collection $harvests,
        public Collection $detections,
        public int $unreadCount,
    ) {
    }

    /**
     * @param  Collection<int, FarmerField>  $fields
     * @param  Collection<int, FarmerCrop>  $crops
     * @param  Collection<int, Harvest>  $harvests
     * @param  Collection<int, DiseaseDetection>  $detections
     */
    public static function assemble(
        ?FarmerProfile $profile,
        Collection $fields,
        Collection $crops,
        Collection $harvests,
        Collection $detections,
        int $unreadCount,
    ): self {
        return new self(
            profile: $profile,
            fields: $fields,
            crops: $crops,
            harvests: $harvests,
            detections: $detections,
            unreadCount: $unreadCount,
        );
    }
}
