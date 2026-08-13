<?php

declare(strict_types=1);

namespace App\Services\GovernmentScheme;

use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\GovernmentScheme;
use App\Models\SchemeApplication;
use App\Models\UploadedFile;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;
use App\Repositories\Contracts\GovernmentSchemeRepositoryInterface;
use App\Repositories\Contracts\SchemeApplicationRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use App\Services\GovernmentScheme\Providers\SchemeDataProviderInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class GovernmentSchemeService implements GovernmentSchemeServiceInterface
{
    private const STATUS_DRAFT = 'draft';

    private const STATUS_SUBMITTED = 'submitted';

    private const VERDICT_ELIGIBLE = 'eligible';

    private const VERDICT_PARTIALLY_ELIGIBLE = 'partially_eligible';

    private const VERDICT_NOT_ELIGIBLE = 'not_eligible';

    /**
     * Upper acreage bound of each farmer category (Indian landholding classes).
     *
     * @var array<string, float>
     */
    private const CATEGORY_THRESHOLDS_ACRES = [
        'marginal' => 2.47,
        'small' => 4.94,
        'semi_medium' => 9.88,
        'medium' => 24.71,
    ];

    public function __construct(
        private readonly GovernmentSchemeRepositoryInterface $schemes,
        private readonly SchemeApplicationRepositoryInterface $applications,
        private readonly FarmerProfileRepositoryInterface $profiles,
        private readonly FarmerFieldRepositoryInterface $fields,
        private readonly UploadedFileRepositoryInterface $files,
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

    public function listSchemes(array $filters = [], int $limit = 20): Collection
    {
        return $this->schemes->listSchemes($filters, $limit);
    }

    public function findScheme(int $schemeId): ?GovernmentScheme
    {
        return $this->schemes->findById($schemeId);
    }

    public function checkEligibility(int $userId, int $schemeId): array
    {
        $scheme = $this->schemes->findById($schemeId);

        if ($scheme === null || ! (bool) $scheme->is_active) {
            throw new DomainException(sprintf('Scheme [%d] is not available.', $schemeId));
        }

        $profile = $this->profiles->findFirstWhere(['user_id' => $userId]);
        $criteria = (array) ($scheme->eligibility_criteria ?? []);

        $checks = [
            'state' => $this->checkState($scheme, $profile),
            'district' => $this->checkDistrict($criteria, $profile),
            'crop' => $this->checkCrop($criteria, $profile, $userId),
            'land_size' => $this->checkLandSize($criteria, $profile, $userId),
            'category' => $this->checkCategory($criteria, $profile, $userId),
            'profile' => $this->checkProfileRequirement($criteria, $profile),
        ];

        $failed = array_filter($checks, fn (array $check): bool => $check['status'] === 'fail');
        $unverified = array_filter($checks, fn (array $check): bool => $check['status'] === 'unverified');

        if ($failed !== []) {
            $verdict = self::VERDICT_NOT_ELIGIBLE;
        } elseif ($unverified !== []) {
            $verdict = self::VERDICT_PARTIALLY_ELIGIBLE;
        } else {
            $verdict = self::VERDICT_ELIGIBLE;
        }

        return [
            'scheme_id' => (int) $scheme->id,
            'verdict' => $verdict,
            'reasons' => array_values(array_map(fn (array $check): string => $check['reason'], $checks)),
            'criteria' => $checks,
        ];
    }

    public function startApplication(int $userId, int $schemeId, array $documents = []): SchemeApplication
    {
        $scheme = $this->schemes->findById($schemeId);

        if ($scheme === null || ! (bool) $scheme->is_active) {
            throw new DomainException(sprintf('Scheme [%d] is not available.', $schemeId));
        }

        $this->assertDeadlineOpen($scheme);

        if ($this->applications->hasOpenApplication($userId, $schemeId)) {
            throw new DomainException('You already have an active application for this scheme.');
        }

        return $this->applications->create([
            'user_id' => $userId,
            'scheme_id' => $schemeId,
            'status' => self::STATUS_DRAFT,
            'submitted_at' => null,
            'documents_json' => $this->normalizeDocuments($userId, $documents),
            'remarks' => null,
        ]);
    }

    public function submitApplication(int $userId, int $applicationId, array $documents = []): ?SchemeApplication
    {
        $application = $this->applications->findForUser($applicationId, $userId);

        if ($application === null) {
            return null;
        }

        if ($application->status !== self::STATUS_DRAFT) {
            throw new DomainException('Only draft applications can be submitted.');
        }

        $scheme = $this->schemes->findById((int) $application->scheme_id);

        if ($scheme === null || ! (bool) $scheme->is_active) {
            throw new DomainException(sprintf('Scheme [%d] is not available.', (int) $application->scheme_id));
        }

        $this->assertDeadlineOpen($scheme);

        $eligibility = $this->checkEligibility($userId, (int) $scheme->id);

        if ($eligibility['verdict'] === self::VERDICT_NOT_ELIGIBLE) {
            $failures = array_values(array_filter(
                $eligibility['criteria'],
                fn (array $check): bool => $check['status'] === 'fail',
            ));

            throw new DomainException(
                'You are not eligible for this scheme: '.implode(' ', array_map(fn (array $check): string => $check['reason'], $failures)),
            );
        }

        $existing = (array) ($application->documents_json ?? []);
        $merged = $this->mergeDocuments($existing, $this->normalizeDocuments($userId, $documents));

        $this->assertRequiredDocuments($scheme, $merged);

        return $this->applications->update($applicationId, [
            'status' => self::STATUS_SUBMITTED,
            'submitted_at' => now(),
            'documents_json' => $merged,
        ]);
    }

    public function getApplication(int $userId, int $applicationId): ?SchemeApplication
    {
        return $this->applications->findForUser($applicationId, $userId);
    }

    public function applicationsForUser(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->applications->applicationsForUser($userId, $filters, $limit);
    }

    public function schemeDashboard(int $userId, ?int $eligibilityLimit = null): array
    {
        $active = $this->schemes->activeSchemes();
        $applications = $this->applications->applicationsForUser($userId, [], 100);

        $candidates = $eligibilityLimit !== null
            ? $active->sortByDesc('id')->take($eligibilityLimit)
            : $active;

        $eligible = $candidates->filter(function (GovernmentScheme $scheme) use ($userId): bool {
            try {
                return $this->checkEligibility($userId, (int) $scheme->id)['verdict'] !== self::VERDICT_NOT_ELIGIBLE;
            } catch (DomainException) {
                return false;
            }
        });

        return [
            'statistics' => [
                'active_schemes' => $active->count(),
                'eligible_schemes' => $eligible->count(),
                'eligibility_evaluated' => $candidates->count(),
                'applied_schemes' => $applications->pluck('scheme_id')->unique()->count(),
                'pending_applications' => $applications
                    ->filter(fn (SchemeApplication $application): bool => in_array($application->status, ['submitted', 'under_review'], true))
                    ->count(),
                'expiring_soon_count' => $this->schemes->expiringSoon(30)->count(),
            ],
            'expiring_soon' => $this->schemes->expiringSoon(30),
            'recent_applications' => $applications->take(5)->values(),
        ];
    }

    public function uploadDocuments(int $userId, array $files): array
    {
        $stored = [];

        foreach ($files as $file) {
            $path = $file->store('scheme-documents/'.$userId, 'local');

            $stored[] = $this->files->create([
                'user_id' => $userId,
                'disk' => 'local',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size_bytes' => $file->getSize(),
                'sha256_hash' => hash_file('sha256', (string) $file->getRealPath()),
                'visibility' => 'private',
            ]);
        }

        return $stored;
    }

    public function syncSchemes(SchemeDataProviderInterface $provider, array $filters = []): array
    {
        $records = $provider->fetch($filters);
        $created = 0;
        $updated = 0;

        foreach ($records as $record) {
            $attributes = $this->schemeAttributes($record);
            $existing = $this->schemes->findFirstWhere(['code' => $attributes['code']]);

            if ($existing === null) {
                $this->schemes->create($attributes);
                $created++;
            } else {
                $this->schemes->update((int) $existing->id, $attributes);
                $updated++;
            }
        }

        return [
            'fetched' => count($records),
            'created' => $created,
            'updated' => $updated,
        ];
    }

    /**
     * @return array{status: string, reason: string}
     */
    private function checkState(GovernmentScheme $scheme, ?FarmerProfile $profile): array
    {
        $schemeState = $scheme->state !== null ? trim((string) $scheme->state) : '';

        if ($schemeState === '') {
            return ['status' => 'pass', 'reason' => 'Central scheme — open to farmers in all states.'];
        }

        if ($profile === null || $profile->state === null || trim((string) $profile->state) === '') {
            return ['status' => 'unverified', 'reason' => 'Your state is not on record; the scheme is limited to '.$schemeState.'.'];
        }

        if (strtolower(trim((string) $profile->state)) === strtolower($schemeState)) {
            return ['status' => 'pass', 'reason' => 'The scheme is open in '.$profile->state.', which matches your state.'];
        }

        return [
            'status' => 'fail',
            'reason' => sprintf('The scheme is limited to %s, but your profile lists %s.', $schemeState, $profile->state),
        ];
    }

    /**
     * @param  array<string, mixed>  $criteria
     * @return array{status: string, reason: string}
     */
    private function checkDistrict(array $criteria, ?FarmerProfile $profile): array
    {
        $districts = array_values(array_map('intval', (array) ($criteria['districts'] ?? [])));

        if ($districts === []) {
            return ['status' => 'pass', 'reason' => 'Open to all districts.'];
        }

        if ($profile === null || $profile->district_id === null) {
            return ['status' => 'unverified', 'reason' => 'Your district is not on record; the scheme targets specific districts.'];
        }

        if (in_array((int) $profile->district_id, $districts, true)) {
            return ['status' => 'pass', 'reason' => 'Your district is covered by this scheme.'];
        }

        return ['status' => 'fail', 'reason' => 'The scheme targets districts that do not include yours.'];
    }

    /**
     * @param  array<string, mixed>  $criteria
     * @return array{status: string, reason: string}
     */
    private function checkCrop(array $criteria, ?FarmerProfile $profile, int $userId): array
    {
        $cropIds = array_values(array_map('intval', (array) ($criteria['crop_ids'] ?? [])));

        if ($cropIds === []) {
            return ['status' => 'pass', 'reason' => 'Open to all crops.'];
        }

        $farmerCropIds = array_values(array_unique(array_filter([
            $profile?->primary_crop_id !== null ? (int) $profile->primary_crop_id : null,
            ...$this->fieldCropIds($userId),
        ], fn (?int $id): bool => $id !== null)));

        if ($farmerCropIds === []) {
            return ['status' => 'unverified', 'reason' => 'No crops on record — add your crops to verify coverage.'];
        }

        if (array_intersect($farmerCropIds, $cropIds) !== []) {
            return ['status' => 'pass', 'reason' => 'One of your crops is covered by this scheme.'];
        }

        return ['status' => 'fail', 'reason' => 'The scheme covers different crops than the ones you grow.'];
    }

    /**
     * @param  array<string, mixed>  $criteria
     * @return array{status: string, reason: string}
     */
    private function checkLandSize(array $criteria, ?FarmerProfile $profile, int $userId): array
    {
        $minAcres = isset($criteria['min_land_acres']) ? (float) $criteria['min_land_acres'] : null;
        $maxAcres = isset($criteria['max_land_acres']) ? (float) $criteria['max_land_acres'] : null;

        if ($minAcres === null && $maxAcres === null) {
            return ['status' => 'pass', 'reason' => 'No land-size restriction.'];
        }

        $landSize = $this->landSizeFor($profile, $userId);

        if ($landSize === null) {
            return ['status' => 'unverified', 'reason' => 'Your land holding is not recorded; the scheme has a land-size restriction.'];
        }

        if ($minAcres !== null && $landSize < $minAcres) {
            return ['status' => 'fail', 'reason' => sprintf('The scheme requires at least %s acres; you hold %s acres.', rtrim(rtrim((string) $minAcres, '0'), '.'), $landSize)];
        }

        if ($maxAcres !== null && $landSize > $maxAcres) {
            return ['status' => 'fail', 'reason' => sprintf('The scheme is limited to %s acres; you hold %s acres.', rtrim(rtrim((string) $maxAcres, '0'), '.'), $landSize)];
        }

        return ['status' => 'pass', 'reason' => sprintf('Your land holding of %s acres qualifies.', $landSize)];
    }

    /**
     * @param  array<string, mixed>  $criteria
     * @return array{status: string, reason: string}
     */
    private function checkCategory(array $criteria, ?FarmerProfile $profile, int $userId): array
    {
        $categories = array_values(array_map('strval', (array) ($criteria['farmer_categories'] ?? [])));

        if ($categories === []) {
            return ['status' => 'pass', 'reason' => 'No farmer category restriction.'];
        }

        $landSize = $this->landSizeFor($profile, $userId);

        if ($landSize === null) {
            return ['status' => 'unverified', 'reason' => 'Your farmer category cannot be determined without a recorded land holding.'];
        }

        $category = $this->categoryFor($landSize);

        if (in_array($category, $categories, true)) {
            return ['status' => 'pass', 'reason' => sprintf('Your farmer category (%s) qualifies.', $category)];
        }

        return [
            'status' => 'fail',
            'reason' => sprintf('The scheme targets %s farmers; you are classified as %s.', implode(', ', $categories), $category),
        ];
    }

    /**
     * @param  array<string, mixed>  $criteria
     * @return array{status: string, reason: string}
     */
    private function checkProfileRequirement(array $criteria, ?FarmerProfile $profile): array
    {
        if (! (bool) ($criteria['requires_profile'] ?? false)) {
            return ['status' => 'pass', 'reason' => 'No farmer profile required.'];
        }

        if ($profile === null) {
            return ['status' => 'unverified', 'reason' => 'A complete farmer profile is required — complete it to verify eligibility.'];
        }

        return ['status' => 'pass', 'reason' => 'Your farmer profile is on record.'];
    }

    /**
     * @return list<int>
     */
    private function fieldCropIds(int $userId): array
    {
        return $this->fields
            ->findWhere(['user_id' => $userId])
            ->map(fn (FarmerField $field): ?int => $field->current_crop_id !== null ? (int) $field->current_crop_id : null)
            ->filter()
            ->map('intval')
            ->values()
            ->all();
    }

    private function landSizeFor(?FarmerProfile $profile, int $userId): ?float
    {
        if ($profile !== null && $profile->farm_size_acres !== null) {
            return (float) $profile->farm_size_acres;
        }

        $sum = $this->fields
            ->findWhere(['user_id' => $userId])
            ->sum(fn (FarmerField $field): float => (float) $field->size_acres);

        return $sum > 0.0 ? $sum : null;
    }

    private function categoryFor(float $landSizeAcres): string
    {
        foreach (self::CATEGORY_THRESHOLDS_ACRES as $category => $threshold) {
            if ($landSizeAcres <= $threshold) {
                return $category;
            }
        }

        return 'large';
    }

    /**
     * Keep only document references the user actually owns.
     *
     * @param  list<array{fileId: int, type: string}>  $documents
     * @return list<array{fileId: int, type: string, name: string}>
     */
    private function normalizeDocuments(int $userId, array $documents): array
    {
        $normalized = [];

        foreach ($documents as $document) {
            $fileId = isset($document['fileId']) ? (int) $document['fileId'] : 0;
            $file = $this->files->findById($fileId);

            if ($file === null || (int) $file->user_id !== $userId) {
                continue;
            }

            $normalized[] = [
                'fileId' => $fileId,
                'type' => (string) ($document['type'] ?? 'document'),
                'name' => (string) $file->original_name,
            ];
        }

        return $normalized;
    }

    /**
     * @param  list<array<string, mixed>>  $existing
     * @param  list<array{fileId: int, type: string, name: string}>  $incoming
     * @return list<array<string, mixed>>
     */
    private function mergeDocuments(array $existing, array $incoming): array
    {
        $merged = $existing;
        $seen = array_map(fn (array $doc): int => (int) ($doc['fileId'] ?? 0), $merged);

        foreach ($incoming as $document) {
            if (! in_array((int) $document['fileId'], $seen, true)) {
                $merged[] = $document;
                $seen[] = (int) $document['fileId'];
            }
        }

        return $merged;
    }

    /**
     * @param  list<array<string, mixed>>  $documents
     */
    private function assertRequiredDocuments(GovernmentScheme $scheme, array $documents): void
    {
        $required = array_values(array_map('strval', (array) ($scheme->documents_required ?? [])));

        if ($required === []) {
            return;
        }

        $provided = array_map(
            fn (array $document): string => strtolower(trim((string) ($document['type'] ?? ''))),
            $documents,
        );

        $missing = array_values(array_filter(
            $required,
            fn (string $requirement): bool => ! in_array(strtolower(trim($requirement)), $provided, true),
        ));

        if ($missing !== []) {
            throw new DomainException('Required documents missing: '.implode(', ', $missing).'.');
        }
    }

    /**
     * @param  array<string, mixed>  $record
     * @return array<string, mixed>
     */
    private function schemeAttributes(array $record): array
    {
        return [
            'code' => (string) ($record['code'] ?? ''),
            'title' => (string) ($record['title'] ?? ''),
            'category' => (string) ($record['category'] ?? 'general'),
            'description' => $record['description'] ?? null,
            'benefits' => $record['benefits'] ?? [],
            'eligibility_criteria' => $record['eligibility_criteria'] ?? [],
            'documents_required' => $record['documents_required'] ?? [],
            'state' => $record['state'] ?? null,
            'deadline' => $record['deadline'] ?? null,
            'apply_url' => $record['apply_url'] ?? null,
            'official_link' => $record['official_link'] ?? null,
            'is_active' => (bool) ($record['is_active'] ?? true),
        ];
    }

    private function assertDeadlineOpen(GovernmentScheme $scheme): void
    {
        if ($scheme->deadline !== null && $scheme->deadline->isPast()) {
            throw new DomainException(sprintf(
                'The application deadline for this scheme passed on %s.',
                $scheme->deadline->toDateString(),
            ));
        }
    }
}
