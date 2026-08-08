<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Contracts;

use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryRequestDTO;

/**
 * Aggregates structured advisory context from the existing module services
 * (weather, soil, crop, disease, market, schemes, equipment, cold storage,
 * transport and the unified dashboard) for one advisory request.
 *
 * Each section degrades gracefully: a module that is unavailable, empty or
 * throws never fails the advisory. No external AI calls and no direct model
 * or database access live here - the engine only composes existing services.
 */
interface AdvisoryContextBuilderInterface
{
    /**
     * Build the full context for an advisory request, merging any client
     * provided context with the aggregated module sections.
     */
    public function build(int $userId, AdvisoryRequestDTO $request): AdvisoryContextDTO;
}
