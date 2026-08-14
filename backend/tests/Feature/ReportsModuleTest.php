<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\GenerateReportJob;
use App\Models\Crop;
use App\Models\ExportHistory;
use App\Models\FarmerProfile;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReportsModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->postJson('/v1/reports', [])->assertUnauthorized();
        $this->getJson('/v1/reports')->assertUnauthorized();
        $this->getJson('/v1/reports/recent')->assertUnauthorized();
        $this->getJson('/v1/reports/favorites')->assertUnauthorized();
        $this->getJson('/v1/reports/1')->assertUnauthorized();
        $this->getJson('/v1/reports/1/download?format=csv')->assertUnauthorized();
        $this->patchJson('/v1/reports/1/favorite')->assertUnauthorized();
        $this->deleteJson('/v1/reports/1')->assertUnauthorized();
    }

    public function test_generation_is_queued_and_report_created(): void
    {
        Queue::fake();

        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'farmer_profile',
            'format' => 'csv',
        ])->assertCreated()
            ->assertJsonPath('data.reportType', 'farmer_profile')
            ->assertJsonPath('data.status', 'generating')
            ->assertJsonPath('data.category', 'Farmer Profile');

        Queue::assertPushed(GenerateReportJob::class);
    }

    public function test_farmer_profile_report_generates_ready_with_csv_file(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $response = $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'farmer_profile',
            'format' => 'csv',
        ])->assertCreated();

        $response->assertJsonPath('data.status', 'ready')
            ->assertJsonPath('data.formats', ['csv'])
            ->assertJsonPath('data.fileFormat', 'CSV')
            ->assertJsonStructure(['data' => ['data' => ['meta' => ['report_type'], 'content' => ['farmer_details']]]])
            ->assertJsonPath('data.data.meta.farmer_id', (int) $user->id)
            ->assertJsonPath('data.downloadUrl.csv', '/v1/reports/'.$response->json('data.id').'/download?format=csv');
    }

    public function test_both_format_report_writes_csv_and_pdf(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'crop',
            'format' => 'both',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonPath('data.fileFormat', 'BOTH')
            ->assertJsonPath('data.formats', ['csv', 'pdf']);
    }

    public function test_soil_report_contains_health_content(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'soil_health',
            'format' => 'csv',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonStructure(['data' => ['data' => ['content' => ['average_health_score']]]]);
    }

    public function test_weather_report_degrades_gracefully_without_location(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'weather',
            'format' => 'csv',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonPath('data.data.content.available', false);
    }

    public function test_disease_report_generates(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'disease_detection',
            'format' => 'csv',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonStructure(['data' => ['data' => ['content' => ['statistics']]]]);
    }

    public function test_market_report_stores_filters(): void
    {
        $user = $this->makeUser();
        $crop = $this->makeCrop();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'market_mandi',
            'format' => 'csv',
            'filters' => [
                'crop_id' => (int) $crop->id,
                'from' => '2026-01-01',
                'to' => '2026-12-31',
            ],
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonPath('data.filters.crop_id', (int) $crop->id)
            ->assertJsonPath('data.data.meta.filters.from', '2026-01-01');
    }

    public function test_scheme_equipment_cold_storage_and_transport_reports_generate(): void
    {
        $user = $this->makeUser();

        foreach (['government_scheme', 'equipment_rental', 'cold_storage', 'transport'] as $type) {
            $this->actingAsUser($user)->postJson('/v1/reports', [
                'report_type' => $type,
                'format' => 'csv',
            ])->assertCreated()
                ->assertJsonPath('data.status', 'ready')
                ->assertJsonStructure(['data' => ['data' => ['content' => ['statistics']]]]);
        }
    }

    public function test_unified_dashboard_report_generates(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'unified_dashboard',
            'format' => 'csv',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonPath('data.data.content.statistics.fields', 0)
            ->assertJsonStructure(['data' => ['data' => ['content' => ['overview', 'weather', 'quickActions']]]]);
    }

    public function test_custom_report_filters_sections(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'custom',
            'format' => 'csv',
            'filters' => ['sections' => 'weather,market'],
        ])->assertCreated()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonMissingPath('data.data.content.overview')
            ->assertJsonStructure(['data' => ['data' => ['content' => ['weather', 'market']]]]);
    }

    public function test_invalid_type_format_and_filters_are_rejected(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->postJson('/v1/reports', ['report_type' => 'bogus', 'format' => 'csv'])->assertStatus(422);
        $this->actingAsUser($user)->postJson('/v1/reports', ['report_type' => 'crop', 'format' => 'xlsx'])->assertStatus(422);
        $this->actingAsUser($user)->postJson('/v1/reports', ['report_type' => 'crop', 'format' => 'csv', 'filters' => ['from' => '2026-12-31', 'to' => '2026-01-01']])->assertStatus(422);
    }

    public function test_show_returns_preview_data_and_ownership_is_enforced(): void
    {
        $owner = $this->makeUser();
        $other = $this->makeUser();
        $id = $this->generateReport($owner, 'crop');

        $this->actingAsUser($owner)->getJson('/v1/reports/'.$id)->assertOk()
            ->assertJsonPath('data.status', 'ready')
            ->assertJsonStructure(['data' => ['data' => ['content']]]);

        $this->actingAsUser($other)->getJson('/v1/reports/'.$id)->assertStatus(404);
    }

    public function test_csv_download_streams_file_and_records_export(): void
    {
        $user = $this->makeUser();
        $id = $this->generateReport($user, 'farmer_profile');

        $response = $this->actingAsUser($user)->get('/v1/reports/'.$id.'/download?format=csv')->assertOk();

        $this->assertStringContainsString('text/csv', (string) $response->headers->get('content-type'));
        $content = $response->streamedContent();
        $this->assertStringContainsString('FasalDrishti Report', $content);
        $this->assertStringContainsString('Section,Key,Value', $content);

        $this->assertDatabaseHas('export_history', [
            'user_id' => (int) $user->id,
            'report_id' => $id,
            'format' => 'CSV',
        ]);
    }

    public function test_pdf_download_streams_valid_pdf(): void
    {
        $user = $this->makeUser();
        $response = $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => 'crop',
            'format' => 'pdf',
        ])->assertCreated();

        $id = (int) $response->json('data.id');

        $download = $this->actingAsUser($user)->get('/v1/reports/'.$id.'/download?format=pdf')->assertOk();

        $this->assertStringContainsString('application/pdf', (string) $download->headers->get('content-type'));
        $content = $download->streamedContent();
        $this->assertStringStartsWith('%PDF-1.4', $content);
        $this->assertStringEndsWith('%%EOF', $content);
        $this->assertStringContainsString('/Type /Page', $content);
    }

    public function test_download_rejects_missing_format_and_other_owners(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $id = $this->generateReport($user, 'crop', 'pdf');

        $this->actingAsUser($user)->getJson('/v1/reports/'.$id.'/download?format=csv')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($other)->getJson('/v1/reports/'.$id.'/download?format=pdf')->assertStatus(404);
    }

    public function test_history_recent_and_type_filter(): void
    {
        $user = $this->makeUser();
        $this->generateReport($user, 'crop');
        $this->generateReport($user, 'soil_health');
        $this->generateReport($user, 'farmer_profile');

        $history = $this->actingAsUser($user)->getJson('/v1/reports?limit=100')->assertOk();
        $this->assertCount(3, $history->json('data'));

        $this->actingAsUser($user)->getJson('/v1/reports?report_type=soil_health')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reportType', 'soil_health');

        $recent = $this->actingAsUser($user)->getJson('/v1/reports/recent')->assertOk();
        $this->assertCount(3, $recent->json('data'));
        $this->assertSame((int) $recent->json('data.0.id') > (int) $recent->json('data.1.id'), true);
    }

    public function test_favorite_toggle_and_favorites_list(): void
    {
        $user = $this->makeUser();
        $id = $this->generateReport($user, 'crop');

        $this->actingAsUser($user)->patchJson('/v1/reports/'.$id.'/favorite')->assertOk()
            ->assertJsonPath('data.favorite', true);

        $this->actingAsUser($user)->getJson('/v1/reports/favorites')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $id);

        $this->actingAsUser($user)->getJson('/v1/reports?favorite=1')->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAsUser($user)->patchJson('/v1/reports/'.$id.'/favorite')->assertOk()
            ->assertJsonPath('data.favorite', false);

        $this->actingAsUser($user)->getJson('/v1/reports/favorites')->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_delete_soft_deletes_and_enforces_ownership(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $id = $this->generateReport($user, 'crop');

        $this->actingAsUser($other)->deleteJson('/v1/reports/'.$id)->assertStatus(404);

        $this->actingAsUser($user)->deleteJson('/v1/reports/'.$id)->assertOk()
            ->assertJsonPath('success', true);

        $this->actingAsUser($user)->getJson('/v1/reports/'.$id)->assertStatus(404);

        $this->assertNotNull(Report::withTrashed()->find($id));
        $this->assertNotNull(Report::withTrashed()->find($id)->deleted_at);
    }

    public function test_reports_are_scoped_per_user(): void
    {
        $userA = $this->makeUser();
        $userB = $this->makeUser();

        $this->generateReport($userA, 'crop');

        $this->actingAsUser($userB)->getJson('/v1/reports')->assertOk()
            ->assertJsonCount(0, 'data');
    }

    private function generateReport(User $user, string $type, string $format = 'csv', array $filters = []): int
    {
        $response = $this->actingAsUser($user)->postJson('/v1/reports', [
            'report_type' => $type,
            'format' => $format,
            'filters' => $filters,
        ])->assertCreated();

        $this->assertSame('ready', $response->json('data.status'));

        return (int) $response->json('data.id');
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

    private function makeProfile(User $user): FarmerProfile
    {
        return FarmerProfile::create([
            'user_id' => (int) $user->id,
            'farm_size_acres' => 5.50,
            'pincode' => '382210',
            'state' => 'Gujarat',
            'village' => 'Test Village',
            'alert_preferences' => ['weather' => true],
        ]);
    }

    private function makeCrop(): Crop
    {
        $crop = Crop::query()->first();

        if ($crop === null) {
            $crop = Crop::create([
                'code' => 'CROP-'.Str::random(6),
                'name' => $this->faker->word().' Crop',
                'name_gujarati' => 'પાક',
                'category' => 'traditional',
                'is_active' => true,
            ]);
        }

        return $crop;
    }
}
