<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Mandi;
use Illuminate\Database\Eloquent\Collection;

interface MandiRepositoryInterface extends BaseRepositoryInterface
{

    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): Collection;

    public function activeMandis(): Collection;
}
