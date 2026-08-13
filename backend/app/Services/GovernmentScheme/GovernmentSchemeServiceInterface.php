<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme;

use App\Models\GovernmentScheme;
use App\Models\SchemeApplication;
use App\Services\GovernmentScheme\Providers\SchemeDataProviderInterface;
use Illuminate\Database\Eloquent\Collection;

interface GovernmentSchemeServiceInterface
{
    public function activeSchemes(): Collection;

    public function schemesByCategory(string $category): Collection;

    /**
     * List active schemes with optional category/state/district/crop/search filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listSchemes(array $filters = [], int $limit = 20): Collection;

    public function findScheme(int $schemeId): ?GovernmentScheme;

    /**
     * Evaluate the farmer against a scheme's eligibility criteria.
     *
     * Verdict is one of eligible / partially_eligible / not_eligible. A check
     * that cannot be evaluated because profile data is missing yields
     * partially_eligible; any hard failure yields not_eligible.
     *
     * @return array{scheme_id: int, verdict: string, reasons: list<string>, criteria: array<string, array{status: string, reason: string}>}
     */
    public function checkEligibility(int $userId, int $schemeId): array;

    /**
     * Open a draft application for a scheme, attaching any documents provided.
     *
     * @param  list<array{fileId: int, type: string}>  $documents
     * @throws \DomainException when the scheme is unavailable, closed or already applied to
     */
    public function startApplication(int $userId, int $schemeId, array $documents = []): SchemeApplication;

    /**
     * Submit a draft application: re-validates eligibility and required
     * documents, then moves the application to submitted.
     *
     * @param  list<array{fileId: int, type: string}>  $documents
     * @throws \DomainException when the application is not a draft, the farmer is
     *                          ineligible, or required documents are missing
     */
    public function submitApplication(int $userId, int $applicationId, array $documents = []): ?SchemeApplication;

    public function getApplication(int $userId, int $applicationId): ?SchemeApplication;

    /**
     * Application history for a user, optionally filtered by status.
     *
     * @param  array<string, mixed>  $filters
     */
    public function applicationsForUser(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * Farmer-facing scheme dashboard: active/eligible/applied counts,
     * expiring-soon schemes and recent applications.
     *
     * When $eligibilityLimit is provided, eligibility is only evaluated for
     * the newest N active schemes (newest first); pass null to evaluate every
     * active scheme. Bounds dashboard cost when many schemes are active.
     *
     * @return array<string, mixed>
     */
    public function schemeDashboard(int $userId, ?int $eligibilityLimit = null): array;

    /**
     * Persist uploaded document files for scheme applications.
     *
     * @param  array<int, \Illuminate\Http\UploadedFile>  $files
     * @return array<int, \App\Models\UploadedFile>
     */
    public function uploadDocuments(int $userId, array $files): array;

    /**
     * Upsert schemes from a data provider by unique code.
     *
     * @param  array<string, mixed>  $filters
     * @return array{fetched: int, created: int, updated: int}
     */
    public function syncSchemes(SchemeDataProviderInterface $provider, array $filters = []): array;
}
