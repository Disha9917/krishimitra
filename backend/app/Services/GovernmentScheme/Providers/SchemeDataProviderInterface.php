<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme\Providers;

/**
 * Contract for external government scheme sources (PM-KISAN portal, state
 * agriculture department APIs, DBT portals, ...).
 *
 * A provider returns normalized scheme records that
 * GovernmentSchemeService::syncSchemes() can upsert by unique `code` —
 * plugging a new source in never touches controllers or the service.
 */
interface SchemeDataProviderInterface
{
    /**
     * Human-readable provider identifier, e.g. "internal" or "pib".
     */
    public function name(): string;

    /**
     * Fetch normalized scheme records.
     *
     * @param  array<string, mixed>  $filters  e.g. state, category
     * @return list<array<string, mixed>> normalized records:
     *                                    code, title, category, description, benefits,
     *                                    eligibility_criteria, documents_required,
     *                                    state, deadline, apply_url, official_link, is_active
     */
    public function fetch(array $filters = []): array;
}
