<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme;

use App\Models\GovernmentScheme;
use App\Models\SchemeApplication;
use Illuminate\Database\Eloquent\Collection;

interface GovernmentSchemeServiceInterface
{
    public function activeSchemes(): Collection;

    public function schemesByCategory(string $category): Collection;

    /**
     * Schemes relevant for a farmer state, optionally narrowed by category.
     */
    public function eligibleSchemes(string $state, ?string $category = null): Collection;

    /**
     * Submit a scheme application, guarding against duplicate pending requests.
     *
     * @throws \DomainException when the scheme is missing or already applied for
     */
    public function applyScheme(int $userId, int $schemeId, ?array $documents = null): SchemeApplication;

    public function applicationsForUser(int $userId): Collection;

    public function findScheme(int $schemeId): ?GovernmentScheme;
}
