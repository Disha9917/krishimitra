<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Crop;
use App\Models\District;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\GovernmentScheme;
use App\Models\Region;
use App\Models\SchemeApplication;
use App\Models\UploadedFile;
use App\Models\User;
use App\Services\GovernmentScheme\Providers\SchemeDataProviderInterface;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile as HttpUploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end tests for the Government Schemes Module (Phase 9G).
 *
 * NOTE: These tests run against the configured Supabase PostgreSQL
 * connection (no RefreshDatabase — the shared database must not be reset).
 * Every record is created with unique identifiers so test runs never clash.
 */
class GovernmentSchemeModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/schemes')->assertUnauthorized();
        $this->getJson('/v1/schemes/dashboard')->assertUnauthorized();
        $this->getJson('/v1/schemes/1/eligibility')->assertUnauthorized();
        $this->postJson('/v1/schemes/1/applications', [])->assertUnauthorized();
        $this->postJson('/v1/schemes/documents', [])->assertUnauthorized();
        $this->postJson('/v1/schemes/sync')->assertUnauthorized();
    }

    public function test_scheme_list_supports_category_state_district_crop_and_search_filters(): void
    {
        $user = $this->makeUser();
        $region = $this->makeRegion();
        $districtA = $this->makeDistrict($region, 'AHM-'.Str::random(4), 'Ahmedabad');
        $districtB = $this->makeDistrict($region, 'SUR-'.Str::random(4), 'Surat');
        $wheat = $this->makeCrop('wheat-lst-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-lst-'.Str::random(6), 'Cotton', 'કપાસ');

        $tagA = Str::random(6);
        $tagB = Str::random(6);
        $tagC = Str::random(6);

        $this->makeScheme([
            'code' => 'INS-'.$tagA,
            'title' => 'Crop Insurance '.$tagA,
            'category' => 'insurance',
            'eligibility_criteria' => ['districts' => [(int) $districtA->id], 'crop_ids' => [(int) $wheat->id]],
        ]);
        $this->makeScheme([
            'code' => 'CRD-'.$tagB,
            'title' => 'Farm Credit '.$tagB,
            'category' => 'credit',
            'state' => 'Gujarat',
            'eligibility_criteria' => ['districts' => [(int) $districtB->id], 'crop_ids' => [(int) $cotton->id]],
        ]);
        $this->makeScheme([
            'code' => 'INS-'.$tagC,
            'title' => 'Rainfall Insurance '.$tagC,
            'category' => 'insurance',
            'state' => 'Gujarat',
        ]);

        $list = $this->actingAsUser($user)->getJson('/v1/schemes?limit=500')
            ->assertOk();
        $titles = array_column($list->json('data'), 'title');
        $this->assertContains('Crop Insurance '.$tagA, $titles);
        $this->assertContains('Farm Credit '.$tagB, $titles);
        $this->assertContains('Rainfall Insurance '.$tagC, $titles);

        $insurance = $this->actingAsUser($user)->getJson('/v1/schemes?category=insurance&limit=100')
            ->assertOk();
        $insuranceTitles = array_column($insurance->json('data'), 'title');
        $this->assertContains('Crop Insurance '.$tagA, $insuranceTitles);
        $this->assertContains('Rainfall Insurance '.$tagC, $insuranceTitles);

        $gujarat = $this->actingAsUser($user)->getJson('/v1/schemes?state=Gujarat&limit=500')
            ->assertOk();
        $gujaratTitles = array_column($gujarat->json('data'), 'title');
        $this->assertContains('Crop Insurance '.$tagA, $gujaratTitles);
        $this->assertContains('Farm Credit '.$tagB, $gujaratTitles);
        $this->assertContains('Rainfall Insurance '.$tagC, $gujaratTitles);

        $this->actingAsUser($user)->getJson('/v1/schemes?districtId='.$districtA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Crop Insurance '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/schemes?cropId='.$cotton->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Farm Credit '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/schemes?search='.$tagC)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'INS-'.$tagC);
    }

    public function test_scheme_details_returns_404_for_unknown_and_inactive_schemes(): void
    {
        $user = $this->makeUser();
        $active = $this->makeScheme(['code' => 'ACT-'.Str::random(6), 'title' => 'Active Scheme']);
        $inactive = $this->makeScheme([
            'code' => 'INA-'.Str::random(6),
            'title' => 'Retired Scheme',
            'is_active' => false,
        ]);

        $this->actingAsUser($user)->getJson('/v1/schemes/'.$active->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $active->id)
            ->assertJsonPath('data.isActive', true);

        $this->actingAsUser($user)->getJson('/v1/schemes/'.$inactive->id)
            ->assertStatus(404);

        $this->actingAsUser($user)->getJson('/v1/schemes/999999999')
            ->assertStatus(404);
    }

    public function test_eligibility_returns_eligible_when_profile_matches_all_criteria(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'KCH-'.Str::random(4), 'Kutch');
        $crop = $this->makeCrop('wheat-eli-'.Str::random(6), 'Wheat', 'ઘઉં');
        $this->makeProfile($user, [
            'state' => 'Gujarat',
            'district_id' => (int) $district->id,
            'farm_size_acres' => 2.5,
            'primary_crop_id' => (int) $crop->id,
        ]);
        $scheme = $this->makeScheme([
            'code' => 'ELI-'.Str::random(6),
            'title' => 'Eligible Scheme',
            'state' => 'Gujarat',
            'eligibility_criteria' => [
                'requires_profile' => true,
                'districts' => [(int) $district->id],
                'crop_ids' => [(int) $crop->id],
                'min_land_acres' => 1.0,
                'max_land_acres' => 10.0,
                'farmer_categories' => ['marginal', 'small'],
            ],
        ]);

        $this->actingAsUser($user)->getJson('/v1/schemes/'.$scheme->id.'/eligibility')
            ->assertOk()
            ->assertJsonPath('data.schemeId', (int) $scheme->id)
            ->assertJsonPath('data.verdict', 'eligible')
            ->assertJsonPath('data.criteria.state.status', 'pass')
            ->assertJsonPath('data.criteria.district.status', 'pass')
            ->assertJsonPath('data.criteria.crop.status', 'pass')
            ->assertJsonPath('data.criteria.land_size.status', 'pass')
            ->assertJsonPath('data.criteria.category.status', 'pass')
            ->assertJsonPath('data.criteria.profile.status', 'pass')
            ->assertJsonCount(6, 'data.reasons');
    }

    public function test_eligibility_returns_partially_eligible_when_profile_is_incomplete(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'BHV-'.Str::random(4), 'Bhavnagar');
        $scheme = $this->makeScheme([
            'code' => 'PAR-'.Str::random(6),
            'title' => 'Partial Scheme',
            'eligibility_criteria' => [
                'requires_profile' => true,
                'districts' => [(int) $district->id],
                'min_land_acres' => 2.0,
            ],
        ]);

        $this->actingAsUser($user)->getJson('/v1/schemes/'.$scheme->id.'/eligibility')
            ->assertOk()
            ->assertJsonPath('data.verdict', 'partially_eligible')
            ->assertJsonPath('data.criteria.district.status', 'unverified')
            ->assertJsonPath('data.criteria.land_size.status', 'unverified');
    }

    public function test_eligibility_returns_not_eligible_for_state_land_and_crop_mismatch(): void
    {
        $user = $this->makeUser();
        $wheat = $this->makeCrop('wheat-ne-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-ne-'.Str::random(6), 'Cotton', 'કપાસ');
        $this->makeProfile($user, [
            'state' => 'Maharashtra',
            'farm_size_acres' => 15.0,
            'primary_crop_id' => (int) $cotton->id,
        ]);
        $this->makeField($user, ['current_crop_id' => (int) $cotton->id]);

        $scheme = $this->makeScheme([
            'code' => 'NE-'.Str::random(6),
            'title' => 'Restricted Scheme',
            'state' => 'Gujarat',
            'eligibility_criteria' => [
                'requires_profile' => true,
                'crop_ids' => [(int) $wheat->id],
                'max_land_acres' => 10.0,
            ],
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/schemes/'.$scheme->id.'/eligibility');

        $response->assertOk()
            ->assertJsonPath('data.verdict', 'not_eligible')
            ->assertJsonPath('data.criteria.state.status', 'fail')
            ->assertJsonPath('data.criteria.crop.status', 'fail')
            ->assertJsonPath('data.criteria.land_size.status', 'fail');
    }

    public function test_farmer_can_start_draft_and_submit_application_with_documents(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'VDR-'.Str::random(4), 'Vadodara');
        $this->makeProfile($user, ['state' => 'Gujarat', 'district_id' => (int) $district->id, 'farm_size_acres' => 3.0]);
        $scheme = $this->makeScheme([
            'code' => 'APP-'.Str::random(6),
            'title' => 'Applicable Scheme',
            'eligibility_criteria' => ['requires_profile' => true, 'districts' => [(int) $district->id]],
            'documents_required' => ['Aadhaar Card'],
        ]);

        $upload = $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [HttpUploadedFile::fake()->create('aadhaar.pdf', 100, 'application/pdf')],
        ]);
        $upload->assertStatus(201)->assertJsonCount(1, 'data');
        $fileId = $upload->json('data.0.id');

        $draft = $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications', [
            'documents' => [['fileId' => $fileId, 'type' => 'Aadhaar Card']],
        ]);

        $draft->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.scheme.id', (int) $scheme->id)
            ->assertJsonPath('data.documents.0.type', 'Aadhaar Card')
            ->assertJsonPath('data.documents.0.fileId', $fileId)
            ->assertJsonPath('data.submittedAt', null);

        $applicationId = $draft->json('data.id');

        $this->assertDatabaseHas('scheme_applications', [
            'id' => $applicationId,
            'user_id' => (int) $user->id,
            'scheme_id' => (int) $scheme->id,
            'status' => 'draft',
        ]);

        $submit = $this->actingAsUser($user)->postJson('/v1/schemes/applications/'.$applicationId.'/submit');

        $submit->assertOk()
            ->assertJsonPath('data.status', 'submitted')
            ->assertJsonPath('message', 'Scheme application submitted successfully.');

        $this->assertDatabaseHas('scheme_applications', [
            'id' => $applicationId,
            'status' => 'submitted',
        ]);
        $this->assertNotNull(
            SchemeApplication::find($applicationId)->submitted_at,
        );
    }

    public function test_duplicate_open_application_is_blocked_but_rejected_allows_reapply(): void
    {
        $user = $this->makeUser();
        $scheme = $this->makeScheme(['code' => 'DUP-'.Str::random(6), 'title' => 'Duplicate Scheme']);

        $submitted = SchemeApplication::create([
            'user_id' => (int) $user->id,
            'scheme_id' => (int) $scheme->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $submitted->update(['status' => 'rejected', 'decided_at' => now()]);

        $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications')
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'draft');
    }

    public function test_submit_is_blocked_for_ineligible_farmer(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user, ['state' => 'Maharashtra']);
        $scheme = $this->makeScheme([
            'code' => 'INE-'.Str::random(6),
            'title' => 'State Bound Scheme',
            'state' => 'Gujarat',
            'eligibility_criteria' => ['requires_profile' => true],
        ]);

        $draft = $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications');
        $draft->assertStatus(201);

        $this->actingAsUser($user)->postJson('/v1/schemes/applications/'.$draft->json('data.id').'/submit')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->assertDatabaseHas('scheme_applications', [
            'id' => $draft->json('data.id'),
            'status' => 'draft',
        ]);
    }

    public function test_submit_requires_all_documents_listed_by_the_scheme(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user, ['state' => 'Gujarat', 'farm_size_acres' => 2.0]);
        $scheme = $this->makeScheme([
            'code' => 'DOC-'.Str::random(6),
            'title' => 'Document Scheme',
            'eligibility_criteria' => ['requires_profile' => true],
            'documents_required' => ['Aadhaar Card', 'Land Records'],
        ]);

        $aadhaar = $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [HttpUploadedFile::fake()->create('aadhaar.pdf', 100, 'application/pdf')],
        ])->json('data.0.id');

        $draft = $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications', [
            'documents' => [['fileId' => $aadhaar, 'type' => 'Aadhaar Card']],
        ])->json('data.id');

        $this->actingAsUser($user)->postJson('/v1/schemes/applications/'.$draft.'/submit')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $land = $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [HttpUploadedFile::fake()->create('land.pdf', 100, 'application/pdf')],
        ])->json('data.0.id');

        $this->actingAsUser($user)->postJson('/v1/schemes/applications/'.$draft.'/submit', [
            'documents' => [['fileId' => $land, 'type' => 'Land Records']],
        ])->assertOk()
            ->assertJsonPath('data.status', 'submitted')
            ->assertJsonCount(2, 'data.documents');
    }

    public function test_applications_are_scoped_to_their_owner(): void
    {
        $owner = $this->makeUser();
        $intruder = $this->makeUser();
        $scheme = $this->makeScheme(['code' => 'OWN-'.Str::random(6), 'title' => 'Owner Scheme']);

        $application = SchemeApplication::create([
            'user_id' => (int) $owner->id,
            'scheme_id' => (int) $scheme->id,
            'status' => 'draft',
        ]);

        $this->actingAsUser($intruder)->getJson('/v1/schemes/applications/'.$application->id)
            ->assertStatus(404);

        $this->actingAsUser($intruder)->postJson('/v1/schemes/applications/'.$application->id.'/submit')
            ->assertStatus(404);

        $this->actingAsUser($owner)->getJson('/v1/schemes/applications/'.$application->id)
            ->assertOk()
            ->assertJsonPath('data.uuid', $application->uuid);
    }

    public function test_history_lists_and_filters_by_status(): void
    {
        $user = $this->makeUser();
        $scheme = $this->makeScheme(['code' => 'HST-'.Str::random(6), 'title' => 'History Scheme']);

        foreach (['draft', 'submitted', 'under_review', 'approved', 'rejected'] as $status) {
            SchemeApplication::create([
                'user_id' => (int) $user->id,
                'scheme_id' => (int) $scheme->id,
                'status' => $status,
                'submitted_at' => $status === 'draft' ? null : now(),
            ]);
        }

        $this->actingAsUser($user)->getJson('/v1/schemes/applications')
            ->assertOk()
            ->assertJsonCount(5, 'data');

        $this->actingAsUser($user)->getJson('/v1/schemes/applications?status=draft')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'draft');

        $this->actingAsUser($user)->getJson('/v1/schemes/applications?status=approved')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'approved');

        $this->actingAsUser($user)->getJson('/v1/schemes/applications?status=archived')
            ->assertStatus(422);
    }

    public function test_dashboard_returns_counts_expiring_soon_and_recent_applications(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'RJK-'.Str::random(4), 'Rajkot');
        $other = $this->makeDistrict($this->makeRegion(), 'JMG-'.Str::random(4), 'Jamnagar');
        $this->makeProfile($user, ['state' => 'Gujarat', 'district_id' => (int) $district->id, 'farm_size_acres' => 5.0]);

        $baseline = $this->actingAsUser($user)->getJson('/v1/schemes/dashboard')->assertOk()->json('data.statistics');

        $near = $this->makeScheme([
            'code' => 'DASH-'.Str::random(6),
            'title' => 'Expiring Scheme',
            'state' => 'Gujarat',
            'deadline' => today()->addDays(7)->toDateString(),
            'eligibility_criteria' => ['requires_profile' => true],
        ]);
        $far = $this->makeScheme([
            'code' => 'DASH-'.Str::random(6),
            'title' => 'Distant Scheme',
            'state' => 'Gujarat',
            'deadline' => today()->addDays(90)->toDateString(),
            'eligibility_criteria' => ['districts' => [(int) $other->id]],
        ]);
        $this->makeScheme([
            'code' => 'DASH-'.Str::random(6),
            'title' => 'Inactive Scheme',
            'is_active' => false,
        ]);

        SchemeApplication::create([
            'user_id' => (int) $user->id,
            'scheme_id' => (int) $near->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/schemes/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.statistics.activeSchemes', $baseline['activeSchemes'] + 2)
            ->assertJsonPath('data.statistics.eligibleSchemes', $baseline['eligibleSchemes'] + 1)
            ->assertJsonPath('data.statistics.appliedSchemes', $baseline['appliedSchemes'] + 1)
            ->assertJsonPath('data.statistics.pendingApplications', $baseline['pendingApplications'] + 1)
            ->assertJsonPath('data.statistics.expiringSoonCount', $baseline['expiringSoonCount'] + 1)
            ->assertJsonCount(1, 'data.recentApplications')
            ->assertJsonPath('data.recentApplications.0.scheme.id', (int) $near->id);

        $this->assertContains(
            (int) $near->id,
            array_column($response->json('data.expiringSoon'), 'id'),
        );
    }

    public function test_application_is_blocked_after_deadline_has_passed(): void
    {
        $user = $this->makeUser();
        $scheme = $this->makeScheme([
            'code' => 'EXP-'.Str::random(6),
            'title' => 'Expired Scheme',
            'deadline' => today()->subDay()->toDateString(),
        ]);

        $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_documents_upload_creates_uploaded_files_and_rejects_invalid(): void
    {
        $user = $this->makeUser();

        $upload = $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [
                HttpUploadedFile::fake()->create('aadhaar.pdf', 100, 'application/pdf'),
                HttpUploadedFile::fake()->create('land.jpg', 100, 'image/jpeg'),
            ],
        ]);

        $upload->assertStatus(201)
            ->assertJsonCount(2, 'data');

        $this->assertSame(2, UploadedFile::where('user_id', $user->id)->count());

        $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [HttpUploadedFile::fake()->create('notes.txt', 100)],
        ])->assertStatus(422);

        $this->actingAsUser($user)->post('/v1/schemes/documents', [
            'documents' => [HttpUploadedFile::fake()->create('huge.pdf', 6000, 'application/pdf')],
        ])->assertStatus(422);
    }

    public function test_sync_upserts_schemes_by_code_from_provider(): void
    {
        $user = $this->makeUser();
        $tag = Str::random(6);

        $provider = new class($tag) implements SchemeDataProviderInterface
        {
            public function __construct(private readonly string $tag)
            {
            }

            public function name(): string
            {
                return 'test-provider';
            }

            public function fetch(array $filters = []): array
            {
                return [
                    [
                        'code' => 'SYNC-A-'.$this->tag,
                        'title' => 'Synced Scheme A',
                        'category' => 'insurance',
                        'description' => 'Synced from provider.',
                        'benefits' => ['Benefit A'],
                        'eligibility_criteria' => ['requires_profile' => false],
                        'documents_required' => ['Aadhaar Card'],
                        'state' => null,
                        'deadline' => null,
                        'apply_url' => null,
                        'official_link' => null,
                        'is_active' => true,
                    ],
                    [
                        'code' => 'SYNC-B-'.$this->tag,
                        'title' => 'Synced Scheme B',
                        'category' => 'credit',
                        'description' => 'State scheme from provider.',
                        'benefits' => ['Benefit B'],
                        'eligibility_criteria' => [],
                        'documents_required' => [],
                        'state' => 'Gujarat',
                        'deadline' => '2026-12-31',
                        'apply_url' => null,
                        'official_link' => null,
                        'is_active' => true,
                    ],
                ];
            }
        };

        $this->app->bind(SchemeDataProviderInterface::class, fn () => $provider);

        $response = $this->actingAsUser($user)->postJson('/v1/schemes/sync');

        $response->assertOk()
            ->assertJsonPath('data.fetched', 2)
            ->assertJsonPath('data.created', 2)
            ->assertJsonPath('data.updated', 0);

        $this->assertDatabaseHas('schemes', ['code' => 'SYNC-A-'.$tag, 'title' => 'Synced Scheme A']);
        $this->assertDatabaseHas('schemes', ['code' => 'SYNC-B-'.$tag, 'state' => 'Gujarat']);

        $response = $this->actingAsUser($user)->postJson('/v1/schemes/sync');

        $response->assertOk()
            ->assertJsonPath('data.created', 0)
            ->assertJsonPath('data.updated', 2);

        $this->assertSame(2, GovernmentScheme::whereIn('code', ['SYNC-A-'.$tag, 'SYNC-B-'.$tag])->count());
    }

    public function test_application_documents_silently_skip_files_owned_by_others(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $scheme = $this->makeScheme(['code' => 'FGN-'.Str::random(6), 'title' => 'Foreign File Scheme']);

        $foreignFile = UploadedFile::create([
            'user_id' => (int) $other->id,
            'disk' => 'local',
            'path' => 'scheme-documents/foreign.pdf',
            'original_name' => 'foreign.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);

        $response = $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications', [
            'documents' => [['fileId' => (int) $foreignFile->id, 'type' => 'Aadhaar Card']],
        ]);

        $response->assertStatus(201)
            ->assertJsonCount(0, 'data.documents');

        $application = SchemeApplication::find($response->json('data.id'));
        $this->assertSame([], $application->documents_json);
    }

    public function test_inactive_scheme_cannot_be_applied_to(): void
    {
        $user = $this->makeUser();
        $scheme = $this->makeScheme([
            'code' => 'OFF-'.Str::random(6),
            'title' => 'Offline Scheme',
            'is_active' => false,
        ]);

        $this->actingAsUser($user)->postJson('/v1/schemes/'.$scheme->id.'/applications')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeScheme(array $attributes): GovernmentScheme
    {
        return GovernmentScheme::create([
            'code' => 'TMP-'.Str::random(6),
            'title' => 'Temporary Scheme',
            'category' => 'general',
            'description' => 'Test scheme.',
            'benefits' => [],
            'eligibility_criteria' => [],
            'documents_required' => [],
            'state' => null,
            'deadline' => null,
            'apply_url' => null,
            'official_link' => null,
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function makeRegion(): Region
    {
        return Region::create([
            'code' => 'RGN-'.Str::random(6),
            'name' => $this->faker->word().' Region',
            'name_gujarati' => 'પ્રદેશ',
            'is_active' => true,
        ]);
    }

    private function makeDistrict(Region $region, string $code, string $name): District
    {
        return District::create([
            'region_id' => (int) $region->id,
            'code' => $code,
            'name' => $name,
            'name_gujarati' => $name,
            'is_active' => true,
        ]);
    }

    private function makeCrop(string $code, string $name, string $nameGujarati): Crop
    {
        return Crop::create([
            'code' => $code,
            'name' => $name,
            'name_gujarati' => $nameGujarati,
            'category' => 'traditional',
            'is_active' => true,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeProfile(User $user, array $attributes): FarmerProfile
    {
        return FarmerProfile::create([
            'user_id' => (int) $user->id,
            'pincode' => '380001',
            ...$attributes,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeField(User $user, array $attributes = []): FarmerField
    {
        return FarmerField::create([
            'user_id' => (int) $user->id,
            'name' => $this->faker->word().' Field',
            'size_acres' => 3.5,
            ...$attributes,
        ]);
    }

    private function makeUser(): User
    {
        $phone = '9'.str_pad((string) mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);

        return User::create([
            'full_name' => $this->faker->name(),
            'phone' => $phone,
            'password_hash' => Hash::make('secret123'),
            'preferred_language' => 'gu',
            'is_active' => true,
        ]);
    }

    private function actingAsUser(User $user): static
    {
        return $this->actingAs($user, 'sanctum');
    }
}
