<?php

declare(strict_types=1);

namespace App\Services\Common;

use App\Repositories\Contracts\CropRepositoryInterface;
use App\Repositories\Contracts\DistrictRepositoryInterface;
use App\Repositories\Contracts\FaqRepositoryInterface;
use App\Repositories\Contracts\MandiRepositoryInterface;
use App\Repositories\Contracts\RegionRepositoryInterface;
use App\Repositories\Contracts\SoilTypeRepositoryInterface;
use App\Repositories\Contracts\TalukaRepositoryInterface;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface;
use App\Repositories\Contracts\VillageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class LookupService implements LookupServiceInterface
{
    public function __construct(
        private readonly RegionRepositoryInterface $regions,
        private readonly DistrictRepositoryInterface $districts,
        private readonly TalukaRepositoryInterface $talukas,
        private readonly VillageRepositoryInterface $villages,
        private readonly CropRepositoryInterface $crops,
        private readonly SoilTypeRepositoryInterface $soilTypes,
        private readonly FaqRepositoryInterface $faqs,
        private readonly TestimonialRepositoryInterface $testimonials,
        private readonly MandiRepositoryInterface $mandis,
        private readonly TransportVehicleTypeRepositoryInterface $vehicleTypes,
    ) {
    }

    public function activeRegions(): Collection
    {
        return $this->regions->activeRegions();
    }

    public function districtsForRegion(int $regionId): Collection
    {
        return $this->districts->districtsForRegion($regionId);
    }

    public function activeDistricts(): Collection
    {
        return $this->districts->activeDistricts();
    }

    public function talukasForDistrict(int $districtId): Collection
    {
        return $this->talukas->talukasForDistrict($districtId);
    }

    public function villagesForTaluka(int $talukaId): Collection
    {
        return $this->villages->villagesForTaluka($talukaId);
    }

    public function activeCrops(): Collection
    {
        return $this->crops->activeCrops();
    }

    public function soilTypes(): Collection
    {
        return $this->soilTypes->findAll();
    }

    public function activeFaqs(): Collection
    {
        return $this->faqs->activeFaqs();
    }

    public function approvedTestimonials(): Collection
    {
        return $this->testimonials->approvedTestimonials();
    }

    public function activeMandis(): Collection
    {
        return $this->mandis->activeMandis();
    }

    public function vehicleTypes(): Collection
    {
        return $this->vehicleTypes->activeTypes();
    }
}
