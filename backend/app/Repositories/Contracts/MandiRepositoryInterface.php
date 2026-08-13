<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface MandiRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * List mandis applying district/state/name-search filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listMandis(array $filters = [], int $limit = 50): Collection;

    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): Collection;

    public function activeMandis(): Collection;
}
