<?php

declare(strict_types=1);

namespace App\Services\Market\Providers;

/**
 * Placeholder for the future Agmarknet API integration.
 *
 * No external calls are made yet — the module is designed so this class can be
 * wired to the real API without any controller or service change.
 */
class AgmarknetProvider implements PriceDataProviderInterface
{
    /**
     * @param  array<string, mixed>  $filters
     * @return list<array<string, mixed>>
     */
    public function fetch(array $filters = []): array
    {
        return [];
    }
}
