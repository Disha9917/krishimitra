<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme;

use App\Models\GovernmentScheme;
use App\Models\SchemeApplication;
use App\Repositories\Contracts\GovernmentSchemeRepositoryInterface;
use App\Repositories\Contracts\SchemeApplicationRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class GovernmentSchemeService implements GovernmentSchemeServiceInterface
{
    private const APPLICATION_STATUS_SUBMITTED = 'submitted';

    public function __construct(
        private readonly GovernmentSchemeRepositoryInterface $schemes,
        private readonly SchemeApplicationRepositoryInterface $applications,
    ) {
    }

    public function activeSchemes(): Collection
    {
        return $this->schemes->activeSchemes();
    }

    public function schemesByCategory(string $category): Collection
    {
        return $this->schemes->schemesByCategory($category);
    }

    public function eligibleSchemes(string $state, ?string $category = null): Collection
    {
        return $this->schemes->activeSchemes()
            ->filter(function (GovernmentScheme $scheme) use ($state, $category): bool {
                if ($category !== null && $scheme->category !== $category) {
                    return false;
                }

                if ($scheme->state !== null && $scheme->state !== '' && strtolower((string) $scheme->state) !== strtolower($state)) {
                    return false;
                }

                return true;
            })
            ->values();
    }

    public function applyScheme(int $userId, int $schemeId, ?array $documents = null): SchemeApplication
    {
        $scheme = $this->schemes->findById($schemeId);

        if ($scheme === null || !(bool) $scheme->is_active) {
            throw new DomainException(sprintf('Scheme [%d] is not available.', $schemeId));
        }

        $duplicate = $this->applications->findFirstWhere([
            'user_id' => $userId,
            'scheme_id' => $schemeId,
            'status' => self::APPLICATION_STATUS_SUBMITTED,
        ]);

        if ($duplicate !== null) {
            throw new DomainException('You have already submitted an application for this scheme.');
        }

        return $this->applications->create([
            'user_id' => $userId,
            'scheme_id' => $schemeId,
            'status' => self::APPLICATION_STATUS_SUBMITTED,
            'submitted_at' => now(),
            'documents_json' => $documents,
            'remarks' => null,
        ]);
    }

    public function applicationsForUser(int $userId): Collection
    {
        return $this->applications->applicationsForUser($userId);
    }

    public function findScheme(int $schemeId): ?GovernmentScheme
    {
        return $this->schemes->findById($schemeId);
    }
}
