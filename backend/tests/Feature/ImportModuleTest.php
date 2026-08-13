<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\ImportCsvJob;
use App\Models\District;
use App\Models\ImportHistory;
use App\Models\Region;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile as HttpUploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class ImportModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->postJson('/v1/admin/imports/validate', [])->assertUnauthorized();
        $this->postJson('/v1/admin/imports/preview', [])->assertUnauthorized();
        $this->postJson('/v1/admin/imports/dry-run', [])->assertUnauthorized();
        $this->postJson('/v1/admin/imports', [])->assertUnauthorized();
        $this->postJson('/v1/admin/imports/1/rollback')->assertUnauthorized();
        $this->getJson('/v1/admin/imports')->assertUnauthorized();
        $this->getJson('/v1/admin/imports/1')->assertUnauthorized();
        $this->getJson('/v1/admin/imports/1/logs')->assertUnauthorized();
    }

    public function test_non_admin_users_are_rejected_with_403(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/admin/imports/validate', [])->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/v1/admin/imports/preview', [])->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/v1/admin/imports/dry-run', [])->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/v1/admin/imports', [])->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/v1/admin/imports/1/rollback')->assertForbidden();
        $this->actingAs($user, 'sanctum')->getJson('/v1/admin/imports')->assertForbidden();
        $this->actingAs($user, 'sanctum')->getJson('/v1/admin/imports/1')->assertForbidden();
        $this->actingAs($user, 'sanctum')->getJson('/v1/admin/imports/1/logs')->assertForbidden();
    }

    public function test_validate_returns_complete_report(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'DIST-'.$region->code;

        $csv = "code,name,name_gujarati,region_code,default_pincode,is_active\n"
            ."{$code},District One,,{$region->code},382001,true\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.datasetType', 'districts')
            ->assertJsonPath('data.datasetLabel', 'Districts')
            ->assertJsonPath('data.totalRows', 1)
            ->assertJsonPath('data.validRows', 1)
            ->assertJsonPath('data.duplicateRows', 0)
            ->assertJsonPath('data.existingRows', 0)
            ->assertJsonPath('data.errorRows', 0)
            ->assertJsonCount(0, 'data.missingHeaders');

        $this->assertSame(0, District::query()->where('code', $code)->count());
    }

    public function test_validate_reports_missing_headers(): void
    {
        $admin = $this->makeAdmin();

        $csv = "code,region_code\nDIST-X,REG-X\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.missingHeaders.0', 'name')
            ->assertJsonPath('data.errorRows', 1)
            ->assertJsonPath('data.validRows', 0);
    }

    public function test_validate_detects_duplicate_rows_within_file(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'DUP-'.Str::random(6);

        $csv = "code,name,region_code\n"
            ."{$code},First,{$region->code}\n"
            ."{$code},Second,{$region->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.validRows', 1)
            ->assertJsonPath('data.duplicateRows', 1);
    }

    public function test_validate_detects_foreign_key_errors(): void
    {
        $admin = $this->makeAdmin();

        $csv = "code,name,region_code\nDIST-BAD,District Bad,MISSING-REGION\n";

        $response = $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk();

        $response->assertJsonPath('data.errorRows', 1)
            ->assertJsonPath('data.errors.0.column', 'region_code');

        $this->assertStringContainsString('does not exist', $response->json('data.errors.0.message'));
    }

    public function test_validate_detects_type_enum_and_format_errors(): void
    {
        $admin = $this->makeAdmin();

        $csv = "code,name,name_gujarati,category,avg_price_per_qtl\n"
            ."CRP-OK,Groundnut,મગફળી,traditional,4500\n"
            ."CRP-BAD,Invalid Crop,ખરાબ,hydroponic,abc\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'crops',
        ])->assertOk()
            ->assertJsonPath('data.validRows', 1)
            ->assertJsonPath('data.errorRows', 1);
    }

    public function test_validate_flags_rows_that_already_exist(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'EXIST-'.Str::random(6);

        District::create(['code' => $code, 'name' => 'Existing', 'region_id' => (int) $region->id]);

        $csv = "code,name,region_code\n{$code},Updated Name,{$region->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/validate', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.validRows', 1)
            ->assertJsonPath('data.existingRows', 1);
    }

    public function test_preview_returns_sample_rows_without_inserting(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $codes = [];

        $rows = [];
        for ($i = 1; $i <= 25; $i++) {
            $code = 'PREV-'.str_pad((string) $i, 3, '0', STR_PAD_LEFT);
            $codes[] = $code;
            $rows[] = $code.",District {$i},,{$region->code},3820".str_pad((string) $i, 2, '0', STR_PAD_LEFT).',true';
        }

        $csv = "code,name,name_gujarati,region_code,default_pincode,is_active\n".implode("\n", $rows)."\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/preview', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.totalRows', 25)
            ->assertJsonPath('data.validRows', 25)
            ->assertJsonCount(20, 'data.preview');

        $this->assertSame(0, District::query()->whereIn('code', $codes)->count());
    }

    public function test_dry_run_reports_without_creating_history(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'DRY-'.Str::random(6);

        $csv = "code,name,region_code\n{$code},Dry District,{$region->code}\n";
        $historyCount = ImportHistory::query()->count();

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/dry-run', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertOk()
            ->assertJsonPath('data.validRows', 1);

        $this->assertSame(0, District::query()->where('code', $code)->count());
        $this->assertSame($historyCount, ImportHistory::query()->count());
    }

    public function test_import_runs_synchronously_and_writes_rows(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'SYNC-'.Str::random(6);

        $csv = "code,name,region_code\n{$code},Sync District,{$region->code}\n";

        $response = $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated();

        $response->assertJsonPath('data.status', 'imported')
            ->assertJsonPath('data.datasetType', 'districts')
            ->assertJsonPath('data.importedRows', 1)
            ->assertJsonPath('data.failedRows', 0)
            ->assertJsonPath('data.progressPercent', 100);

        $district = District::query()->where('code', $code)->first();
        $this->assertNotNull($district);
        $this->assertSame('Sync District', $district->name);
        $this->assertSame((int) $region->id, (int) $district->region_id);

        $history = ImportHistory::query()->findOrFail((int) $response->json('data.id'));
        $this->assertSame((int) $admin->id, (int) $history->uploaded_by);
        $this->assertNotNull($history->file_path);
        $this->assertNotNull($history->started_at);
        $this->assertNotNull($history->finished_at);
    }

    public function test_import_upserts_existing_rows(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'UPST-'.Str::random(6);

        $csv = "code,name,region_code\n{$code},Original Name,{$region->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated()
            ->assertJsonPath('data.importedRows', 1);

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated()
            ->assertJsonPath('data.importedRows', 0)
            ->assertJsonPath('data.updatedRows', 1);

        $district = District::query()->where('code', $code)->first();
        $this->assertSame('Original Name', $district->name);
        $this->assertSame(1, District::query()->where('code', $code)->count());
    }

    public function test_import_skips_duplicate_rows_within_file(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'SKIP-'.Str::random(6);

        $csv = "code,name,region_code\n"
            ."{$code},First,{$region->code}\n"
            ."{$code},Duplicate,{$region->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated()
            ->assertJsonPath('data.importedRows', 1)
            ->assertJsonPath('data.skippedRows', 1)
            ->assertJsonPath('data.status', 'imported');

        $district = District::query()->where('code', $code)->first();
        $this->assertSame('First', $district->name);
    }

    public function test_import_with_error_rows_finishes_partial_and_logs_failures(): void
    {
        $admin = $this->makeAdmin();
        $okCode = 'PART-OK-'.Str::random(6);

        $csv = "code,name,name_gujarati,category\n"
            ."{$okCode},Good Crop,સારો,traditional\n"
            .'PART-BAD-'.Str::random(6).",Bad Crop,ખરાબ,hydroponic\n";

        $response = $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'crops',
        ])->assertCreated();

        $response->assertJsonPath('data.status', 'partial')
            ->assertJsonPath('data.importedRows', 1)
            ->assertJsonPath('data.failedRows', 1);

        $importId = (int) $response->json('data.id');

        $this->actingAs($admin, 'sanctum')->getJson('/v1/admin/imports/'.$importId.'/logs')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.action', 'inserted')
            ->assertJsonPath('data.1.action', 'failed');
    }

    public function test_import_talukas_resolves_district_foreign_keys(): void
    {
        $admin = $this->makeAdmin();
        $district = $this->makeDistrict();
        $code = 'TAL-'.Str::random(6);

        $csv = "code,name,district_code\n{$code},Taluka One,{$district->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'talukas',
        ])->assertCreated()
            ->assertJsonPath('data.importedRows', 1);

        $this->assertDatabaseHas('talukas', [
            'code' => $code,
            'district_id' => (int) $district->id,
        ]);
    }

    public function test_import_rejects_missing_headers_and_empty_files(): void
    {
        $admin = $this->makeAdmin();

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv("code,region_code\nX-1,R-1\n"),
            'dataset_type' => 'districts',
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv("code,name,region_code\n"),
            'dataset_type' => 'districts',
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_import_rejects_invalid_dataset_type_and_bad_file(): void
    {
        $admin = $this->makeAdmin();

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv("code,name\nA,One\n"),
            'dataset_type' => 'galaxies',
        ])->assertStatus(422);

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => HttpUploadedFile::fake()->create('notes.txt', 100),
            'dataset_type' => 'crops',
        ])->assertStatus(422);
    }

    public function test_large_imports_are_queued(): void
    {
        config(['import.sync_threshold' => -1]);
        Queue::fake();

        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'QUEUE-'.Str::random(6);

        $csv = "code,name,region_code\n{$code},Queued District,{$region->code}\n";

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'queued');

        Queue::assertPushed(ImportCsvJob::class);
        $this->assertSame(0, District::query()->where('code', $code)->count());

        config(['import.sync_threshold' => 500]);
    }

    public function test_import_history_lists_and_filters(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();

        $first = (int) $this->importDistrict($admin, 'HIST-'.Str::random(6), $region)->json('data.id');
        $second = (int) $this->importDistrict($admin, 'HIST-'.Str::random(6), $region)->json('data.id');

        $list = $this->actingAs($admin, 'sanctum')->getJson('/v1/admin/imports')->assertOk();
        $this->assertContains($first, $list->json('data.*.id'));
        $this->assertContains($second, $list->json('data.*.id'));

        $filtered = $this->actingAs($admin, 'sanctum')->getJson('/v1/admin/imports?dataset_type=districts&status=imported')->assertOk();
        $this->assertContains($first, $filtered->json('data.*.id'));
        $this->assertContains($second, $filtered->json('data.*.id'));
    }

    public function test_import_progress_detail_is_exposed(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();

        $response = $this->importDistrict($admin, 'PROG-'.Str::random(6), $region);
        $importId = (int) $response->json('data.id');

        $this->actingAs($admin, 'sanctum')->getJson('/v1/admin/imports/'.$importId)->assertOk()
            ->assertJsonPath('data.status', 'imported')
            ->assertJsonPath('data.processedRows', 1)
            ->assertJsonPath('data.progressPercent', 100)
            ->assertJsonStructure(['data' => ['startedAt', 'finishedAt', 'durationMs']]);
    }

    public function test_rollback_deletes_inserted_and_restores_updated_rows(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();
        $code = 'RBLK-'.Str::random(6);

        $existing = District::create(['code' => $code, 'name' => 'Original Name', 'region_id' => (int) $region->id]);
        $newCode = 'NEW-'.Str::random(6);

        $csv = "code,name,region_code\n"
            ."{$code},Changed Name,{$region->code}\n"
            ."{$newCode},New District,{$region->code}\n";

        $response = $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated();

        $importId = (int) $response->json('data.id');
        $this->assertSame('Changed Name', District::query()->findOrFail((int) $existing->id)->name);

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/'.$importId.'/rollback')->assertOk()
            ->assertJsonPath('data.status', 'rolled_back');

        $this->assertSame('Original Name', District::query()->findOrFail((int) $existing->id)->name);
        $this->assertSame(1, District::query()->where('code', $code)->count());
        $this->assertSame(0, District::query()->where('code', $newCode)->count());
    }

    public function test_rollback_rejects_incomplete_imports(): void
    {
        $admin = $this->makeAdmin();
        $region = $this->makeRegion();

        config(['import.sync_threshold' => -1]);
        Queue::fake();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv("code,name,region_code\nRBQ-1,Queued,{$region->code}\n"),
            'dataset_type' => 'districts',
        ])->assertCreated();

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/'.(int) $response->json('data.id').'/rollback')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports/99999999/rollback')->assertStatus(404);

        config(['import.sync_threshold' => 500]);
    }

    private function importDistrict(User $admin, string $code, Region $region): TestResponse
    {
        $csv = "code,name,region_code\n{$code},District {$code},{$region->code}\n";

        return $this->actingAs($admin, 'sanctum')->postJson('/v1/admin/imports', [
            'file' => $this->csv($csv),
            'dataset_type' => 'districts',
        ])->assertCreated();
    }

    private function makeAdmin(): User
    {
        $user = $this->makeUser();
        $role = Role::firstOrCreate(
            ['code' => 'admin'],
            ['code' => 'admin', 'name' => 'Administrator', 'is_system' => true],
        );

        $user->roles()->syncWithoutDetaching([(int) $role->id]);

        return $user;
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

    private function makeRegion(): Region
    {
        return Region::create([
            'code' => 'REG-'.Str::random(6),
            'name' => 'Region '.Str::random(6),
            'is_active' => true,
        ]);
    }

    private function makeDistrict(): District
    {
        $region = $this->makeRegion();

        return District::create([
            'code' => 'DST-'.Str::random(6),
            'name' => 'District '.Str::random(6),
            'region_id' => (int) $region->id,
            'is_active' => true,
        ]);
    }

    private function csv(string $content): HttpUploadedFile
    {
        return HttpUploadedFile::fake()->createWithContent('dataset.csv', $content);
    }
}
