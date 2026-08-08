<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Crop;
use App\Models\FarmerField;
use App\Models\SoilHistory;
use App\Models\SoilTest;
use App\Models\SoilType;
use App\Models\User;
use App\Services\Soil\SoilServiceInterface;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end tests for the Soil Module (Phase 9D).
 *
 * NOTE: These tests run against the configured Supabase PostgreSQL
 * connection (no RefreshDatabase — the shared database must not be reset).
 * Every record is created with unique identifiers so test runs never clash.
 */
class SoilModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/soil/tests')->assertUnauthorized();
        $this->postJson('/v1/soil/tests', [])->assertUnauthorized();
        $this->getJson('/v1/soil/history')->assertUnauthorized();
        $this->getJson('/v1/soil/dashboard')->assertUnauthorized();
    }

    public function test_farmer_can_create_a_soil_test_with_auto_calculated_health(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('wheat-test-'.Str::random(6), 'Wheat', 'ઘઉં');
        $soilType = $this->makeSoilType('alluvial-test-'.Str::random(6), 'Alluvial');

        $response = $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'labName' => 'Krishi Vigyan Kendra Lab',
            'reportDate' => today()->toDateString(),
            'ph' => 6.8,
            'ec' => 0.5,
            'nitrogenKgHa' => 320,
            'phosphorusKgHa' => 15,
            'potassiumKgHa' => 150,
            'organicCarbonPct' => 0.6,
            'moisturePct' => 25,
            'micronutrients' => ['zincMgKg' => 0.8, 'ironMgKg' => 4.5],
            'soilTexture' => 'sandy loam',
            'soilTypeId' => (int) $soilType->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.field.id', (int) $field->id)
            ->assertJsonPath('data.crop.id', (int) $crop->id)
            ->assertJsonPath('data.ph', 6.8)
            ->assertJsonPath('data.soilStatus', 'healthy')
            ->assertJsonPath('data.fertilityLevel', 'high')
            ->assertJsonPath('data.healthScore', 84)
            ->assertJsonPath('data.micronutrients.zincMgKg', 0.8);

        $testId = $response->json('data.id');

        $this->assertDatabaseHas('soil_tests', [
            'id' => $testId,
            'user_id' => (int) $user->id,
            'field_id' => (int) $field->id,
            'crop_id' => (int) $crop->id,
            'health_score' => 84.00,
            'soil_status' => 'healthy',
        ]);

        $this->assertDatabaseHas('soil_history', [
            'field_id' => (int) $field->id,
            'soil_test_id' => $testId,
        ]);
    }

    public function test_validation_rejects_unrealistic_nutrient_values(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'ph' => 16,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'ph' => -1,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'nitrogenKgHa' => -5,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'phosphorusKgHa' => -10,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'potassiumKgHa' => -1,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'organicCarbonPct' => -0.1,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'moisturePct' => 150,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'ec' => -1,
        ])->assertStatus(422);

        $this->assertDatabaseMissing('soil_tests', ['user_id' => (int) $user->id]);
    }

    public function test_farmer_cannot_create_a_test_on_someone_elses_field(): void
    {
        $owner = $this->makeUser();
        $field = $this->makeField($owner);
        $intruder = $this->makeUser();

        $this->actingAsUser($intruder)->postJson('/v1/soil/tests', [
            'fieldId' => (int) $field->id,
            'ph' => 7.0,
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_ownership_is_enforced_on_show_update_and_delete(): void
    {
        $owner = $this->makeUser();
        $field = $this->makeField($owner);
        $test = $this->makeTest($owner, $field);
        $intruder = $this->makeUser();

        $this->actingAsUser($intruder)->getJson('/v1/soil/tests/'.$test->id)
            ->assertStatus(404);

        $this->actingAsUser($intruder)->putJson('/v1/soil/tests/'.$test->id, [
            'ph' => 7.2,
        ])->assertStatus(422);

        $this->actingAsUser($intruder)->deleteJson('/v1/soil/tests/'.$test->id)
            ->assertStatus(422);

        $this->assertDatabaseHas('soil_tests', ['id' => $test->id, 'deleted_at' => null]);
    }

    public function test_farmer_can_view_their_soil_test(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $test = $this->makeTest($user, $field);

        $this->actingAsUser($user)->getJson('/v1/soil/tests/'.$test->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $test->id)
            ->assertJsonPath('data.field.id', (int) $field->id);
    }

    public function test_update_recalculates_health_and_appends_history(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $test = $this->makeTest($user, $field, [
            'ph' => 5.2,
            'nitrogen_kg_ha' => 200,
            'phosphorus_kg_ha' => 5,
            'potassium_kg_ha' => 100,
            'organic_carbon_pct' => 0.3,
        ]);

        $this->assertSame('poor', $test->fresh()->soil_status);

        $response = $this->actingAsUser($user)->putJson('/v1/soil/tests/'.$test->id, [
            'ph' => 7.0,
            'nitrogenKgHa' => 600,
            'phosphorusKgHa' => 30,
            'potassiumKgHa' => 350,
            'organicCarbonPct' => 0.9,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.soilStatus', 'healthy')
            ->assertJsonPath('data.healthScore', 100);

        $this->assertSame(2, SoilHistory::where('soil_test_id', $test->id)->count());
    }

    public function test_soft_delete_removes_test_from_api_but_keeps_history(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $test = $this->makeTest($user, $field);

        $this->actingAsUser($user)->deleteJson('/v1/soil/tests/'.$test->id)
            ->assertOk()
            ->assertJsonPath('message', 'Soil test deleted successfully.');

        $this->actingAsUser($user)->getJson('/v1/soil/tests/'.$test->id)
            ->assertStatus(404);

        $this->assertSoftDeleted('soil_tests', ['id' => $test->id]);
        $this->assertDatabaseHas('soil_history', ['soil_test_id' => (int) $test->id]);
    }

    public function test_list_supports_field_crop_and_date_filters(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $otherField = $this->makeField($user);
        $wheat = $this->makeCrop('wheat-list-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-list-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makeTest($user, $field, [
            'crop_id' => (int) $wheat->id,
            'report_date' => '2026-07-01',
        ]);
        $this->makeTest($user, $field, [
            'crop_id' => (int) $cotton->id,
            'report_date' => '2026-08-01',
        ]);
        $this->makeTest($user, $otherField, [
            'crop_id' => (int) $wheat->id,
            'report_date' => '2026-08-05',
        ]);

        $this->actingAsUser($user)->getJson('/v1/soil/tests')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAsUser($user)->getJson('/v1/soil/tests?fieldId='.$otherField->id)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAsUser($user)->getJson('/v1/soil/tests?cropId='.$cotton->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.crop.id', (int) $cotton->id);

        $this->actingAsUser($user)->getJson('/v1/soil/tests?from=2026-07-15&to=2026-08-02')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_history_supports_field_crop_and_date_filters(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $otherField = $this->makeField($user);
        $wheat = $this->makeCrop('wheat-hist-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-hist-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makeTest($user, $field, [
            'crop_id' => (int) $wheat->id,
            'report_date' => '2026-07-10',
        ]);
        $this->makeTest($user, $field, [
            'crop_id' => (int) $cotton->id,
            'report_date' => '2026-08-01',
        ]);
        $this->makeTest($user, $otherField, [
            'crop_id' => (int) $wheat->id,
            'report_date' => '2026-08-06',
        ]);

        $this->actingAsUser($user)->getJson('/v1/soil/history')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.healthScore', 84);

        $this->actingAsUser($user)->getJson('/v1/soil/history?fieldId='.$otherField->id)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAsUser($user)->getJson('/v1/soil/history?cropId='.$cotton->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.crop.id', (int) $cotton->id);

        $this->actingAsUser($user)->getJson('/v1/soil/history?from=2026-08-01&to=2026-08-31')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_health_endpoint_returns_score_summary_and_alerts(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $this->makeTest($user, $field, [
            'ph' => 5.2,
            'ec' => 0.5,
            'nitrogen_kg_ha' => 200,
            'phosphorus_kg_ha' => 5,
            'potassium_kg_ha' => 100,
            'organic_carbon_pct' => 0.3,
            'moisture_pct' => 8,
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/soil/health/'.$field->id);

        $response->assertOk()
            ->assertJsonPath('data.hasData', true)
            ->assertJsonPath('data.healthScore', 44)
            ->assertJsonPath('data.soilStatus', 'poor')
            ->assertJsonPath('data.fertilityLevel', 'low')
            ->assertJsonPath('data.nutrientSummary.ph.band', 'acidic')
            ->assertJsonPath('data.nutrientSummary.nitrogen_kg_ha.band', 'low')
            ->assertJsonPath('data.nutrientSummary.moisture_pct.band', 'low');

        $alertTypes = collect($response->json('data.alerts'))->pluck('type')->all();

        $this->assertContains('acidity', $alertTypes);
        $this->assertContains('nitrogen_deficiency', $alertTypes);
        $this->assertContains('phosphorus_deficiency', $alertTypes);
        $this->assertContains('potassium_deficiency', $alertTypes);
        $this->assertContains('low_organic_carbon', $alertTypes);
        $this->assertContains('dry_soil', $alertTypes);
    }

    public function test_health_endpoint_returns_empty_state_without_tests(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);

        $this->actingAsUser($user)->getJson('/v1/soil/health/'.$field->id)
            ->assertOk()
            ->assertJsonPath('data.hasData', false)
            ->assertJsonPath('data.healthScore', null);
    }

    public function test_dashboard_returns_latest_report_average_charts_and_alerts(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $fieldB = $this->makeField($user);

        $this->makeTest($user, $field, [
            'report_date' => '2026-07-20',
        ]);
        $this->makeTest($user, $field, [
            'report_date' => '2026-08-05',
            'ph' => 6.9,
            'nitrogen_kg_ha' => 330,
            'phosphorus_kg_ha' => 16,
            'potassium_kg_ha' => 155,
            'organic_carbon_pct' => 0.65,
        ]);
        $this->makeTest($user, $fieldB, [
            'report_date' => '2026-08-01',
            'ph' => 5.2,
            'nitrogen_kg_ha' => 200,
            'phosphorus_kg_ha' => 5,
            'potassium_kg_ha' => 100,
            'organic_carbon_pct' => 0.3,
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/soil/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.latestReport.reportDate', '2026-08-05')
            ->assertJsonPath('data.averageHealthScore', 70.67)
            ->assertJsonPath('data.statusDistribution.healthy', 2)
            ->assertJsonPath('data.statusDistribution.poor', 1)
            ->assertJsonPath('data.testsCount', 3)
            ->assertJsonPath('data.fieldsCount', 2);

        $charts = $response->json('data.nutrientCharts');

        $this->assertCount(3, $charts['ph']);
        $this->assertSame('2026-08-05', $charts['ph'][0]['sampledOn']);

        $alerts = $response->json('data.alerts');

        $this->assertCount(1, $alerts);
        $this->assertSame((int) $fieldB->id, $alerts[0]['field_id']);
    }

    public function test_recommendations_are_rule_based_and_complete(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $test = $this->makeTest($user, $field, [
            'ph' => 5.2,
            'nitrogen_kg_ha' => 200,
            'phosphorus_kg_ha' => 5,
            'potassium_kg_ha' => 350,
            'organic_carbon_pct' => 0.3,
            'moisture_pct' => 15,
            'soil_texture' => 'sandy loam',
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/soil/tests/'.$test->id.'/recommendations');

        $response->assertOk()
            ->assertJsonPath('data.testId', (int) $test->id)
            ->assertJsonPath('data.limeRequirement.required', true)
            ->assertJsonPath('data.limeRequirement.tonsPerHectare', 1.5)
            ->assertJsonPath('data.organicMatter.level', 'low')
            ->assertJsonPath('data.irrigation.irrigateNow', true);

        $fertilizer = $response->json('data.fertilizer');

        $this->assertCount(3, $fertilizer);
        $this->assertSame('Nitrogen (N)', $fertilizer[0]['nutrient']);
        $this->assertSame('low', $fertilizer[0]['band']);
        $this->assertSame(100, $fertilizer[0]['suggestedKgPerHa']);
        $this->assertSame('high', $fertilizer[2]['band']);
        $this->assertNull($fertilizer[2]['suggestedKgPerHa']);
    }

    public function test_recommendations_are_empty_for_unknown_test(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->getJson('/v1/soil/tests/999999999/recommendations')
            ->assertStatus(404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeTest(User $user, FarmerField $field, array $attributes = []): SoilTest
    {
        $data = [
            'report_date' => '2026-08-01',
            'ph' => 6.8,
            'ec' => 0.5,
            'nitrogen_kg_ha' => 320,
            'phosphorus_kg_ha' => 15,
            'potassium_kg_ha' => 150,
            'organic_carbon_pct' => 0.6,
            'moisture_pct' => 25,
            ...$attributes,
        ];

        return app(SoilServiceInterface::class)
            ->createSoilTest((int) $user->id, (int) $field->id, $data);
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

    private function makeField(User $user): FarmerField
    {
        return FarmerField::create([
            'user_id' => (int) $user->id,
            'name' => $this->faker->word().' Field',
            'size_acres' => 3.5,
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

    private function makeSoilType(string $code, string $name): SoilType
    {
        return SoilType::create([
            'code' => $code,
            'name' => $name,
        ]);
    }

    private function actingAsUser(User $user): static
    {
        return $this->withToken($user->createToken('soil-test')->plainTextToken);
    }
}
