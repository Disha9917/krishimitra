<?php

declare(strict_types=1);

namespace App\Services\Common;

use Illuminate\Database\Eloquent\Collection;

interface LookupServiceInterface
{
    public function activeRegions(): Collection;

    public function districtsForRegion(int $regionId): Collection;

    public function activeDistricts(): Collection;

    public function talukasForDistrict(int $districtId): Collection;

    public function villagesForTaluka(int $talukaId): Collection;

    public function activeCrops(): Collection;

    public function soilTypes(): Collection;

    public function activeFaqs(): Collection;

    public function approvedTestimonials(): Collection;

    public function activeMandis(): Collection;

    public function vehicleTypes(): Collection;
}
