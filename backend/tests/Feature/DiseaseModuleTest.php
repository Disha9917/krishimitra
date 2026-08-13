<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Crop;
use App\Models\Disease;
use App\Models\DiseaseDetection;
use App\Models\DiseaseHistory;
use App\Models\DiseaseImage;
use App\Models\FarmerField;
use App\Models\TreatmentRecommendation;
use App\Models\UploadedFile;
use App\Models\User;
use App\Services\Disease\DiseaseServiceInterface;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile as HttpUploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end tests for the Disease Module (Phase 9E).
 *
 * NOTE: These tests run against the configured Supabase PostgreSQL
 * connection (no RefreshDatabase — the shared database must not be reset).
 * Every record is created with unique identifiers so test runs never clash.
 */
class DiseaseModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/disease/detections')->assertUnauthorized();
        $this->postJson('/v1/disease/detections', [])->assertUnauthorized();
        $this->getJson('/v1/disease/history')->assertUnauthorized();
        $this->getJson('/v1/disease/dashboard')->assertUnauthorized();
        $this->postJson('/v1/disease/images')->assertUnauthorized();
    }

    public function test_farmer_can_create_a_detection_with_history_trail(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('wheat-det-'.Str::random(6), 'Wheat', 'ઘઉં');

        $response = $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'diseaseName' => 'Leaf Rust',
            'scientificName' => 'Puccinia triticina',
            'description' => 'Orange-brown pustules on the leaves.',
            'symptoms' => ['Orange pustules', 'Leaf yellowing'],
            'confidenceScore' => 92.5,
            'severity' => 'high',
            'detectionSource' => 'manual',
            'modelVersion' => 'v1.2',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.field.id', (int) $field->id)
            ->assertJsonPath('data.crop.id', (int) $crop->id)
            ->assertJsonPath('data.diseaseName', 'Leaf Rust')
            ->assertJsonPath('data.confidenceScore', 92.5)
            ->assertJsonPath('data.confidence', 'High')
            ->assertJsonPath('data.severity', 'high')
            ->assertJsonPath('data.detectionSource', 'manual')
            ->assertJsonPath('data.detectionStatus', 'confirmed')
            ->assertJsonCount(2, 'data.symptoms');

        $detectionId = $response->json('data.id');

        $this->assertDatabaseHas('disease_detections', [
            'id' => $detectionId,
            'user_id' => (int) $user->id,
            'field_id' => (int) $field->id,
            'crop_id' => (int) $crop->id,
            'severity' => 'high',
        ]);

        $this->assertDatabaseHas('disease_history', [
            'detection_id' => $detectionId,
            'user_id' => (int) $user->id,
            'field_id' => (int) $field->id,
            'crop_id' => (int) $crop->id,
            'resolved' => false,
            'recurrence_count' => 0,
        ]);
    }

    public function test_ai_detection_can_be_recorded_with_pending_status(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('cotton-ai-'.Str::random(6), 'Cotton', 'કપાસ');

        $response = $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'diseaseName' => 'Boll Rot',
            'confidenceScore' => 61,
            'severity' => 'medium',
            'detectionSource' => 'ai',
            'detectionStatus' => 'pending',
            'modelVersion' => 'ai-model-3.1',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.detectionSource', 'ai')
            ->assertJsonPath('data.detectionStatus', 'pending')
            ->assertJsonPath('data.confidence', 'Medium')
            ->assertJsonPath('data.modelVersion', 'ai-model-3.1');

        $this->assertDatabaseHas('disease_detections', [
            'id' => $response->json('data.id'),
            'detection_source' => 'ai',
            'detection_status' => 'pending',
        ]);
    }

    public function test_validation_rejects_invalid_severity_confidence_and_missing_fields(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('rice-val-'.Str::random(6), 'Rice', 'ચોખા');

        $base = [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'diseaseName' => 'Blast',
            'confidenceScore' => 70,
            'severity' => 'high',
        ];

        $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            ...$base,
            'severity' => 'severe',
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            ...$base,
            'confidenceScore' => 150,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            ...$base,
            'confidenceScore' => -10,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            ...$base,
            'detectionSource' => 'robot',
        ])->assertStatus(422);

        $this->assertDatabaseMissing('disease_detections', ['user_id' => (int) $user->id]);
    }

    public function test_farmer_cannot_create_a_detection_on_someone_elses_field(): void
    {
        $owner = $this->makeUser();
        $field = $this->makeField($owner);
        $crop = $this->makeCrop('maize-own-'.Str::random(6), 'Maize', 'મકાઈ');
        $intruder = $this->makeUser();

        $this->actingAsUser($intruder)->postJson('/v1/disease/detections', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'diseaseName' => 'Smut',
            'confidenceScore' => 80,
            'severity' => 'critical',
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_ownership_is_enforced_on_show_update_and_delete(): void
    {
        $owner = $this->makeUser();
        $field = $this->makeField($owner);
        $crop = $this->makeCrop('sugarcane-own-'.Str::random(6), 'Sugarcane', 'શેરડી');
        $detection = $this->makeDetection($owner, $field, $crop);
        $intruder = $this->makeUser();

        $this->actingAsUser($intruder)->getJson('/v1/disease/detections/'.$detection->id)
            ->assertStatus(404);

        $this->actingAsUser($intruder)->putJson('/v1/disease/detections/'.$detection->id, [
            'severity' => 'low',
        ])->assertStatus(422);

        $this->actingAsUser($intruder)->deleteJson('/v1/disease/detections/'.$detection->id)
            ->assertStatus(422);

        $this->assertDatabaseHas('disease_detections', ['id' => $detection->id, 'deleted_at' => null]);
    }

    public function test_farmer_can_view_their_detection(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('pulses-view-'.Str::random(6), 'Pulses', 'કઠોળ');
        $detection = $this->makeDetection($user, $field, $crop);

        $this->actingAsUser($user)->getJson('/v1/disease/detections/'.$detection->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $detection->id)
            ->assertJsonPath('data.field.id', (int) $field->id)
            ->assertJsonPath('data.crop.id', (int) $crop->id);
    }

    public function test_update_changes_detection_but_never_overwrites_history(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('tomato-upd-'.Str::random(6), 'Tomato', 'ટામેટાં');
        $detection = $this->makeDetection($user, $field, $crop, [
            'severity' => 'medium',
            'confidence_score' => 55,
        ]);

        $this->assertSame(1, DiseaseHistory::where('detection_id', $detection->id)->count());

        $response = $this->actingAsUser($user)->putJson('/v1/disease/detections/'.$detection->id, [
            'severity' => 'critical',
            'detectionStatus' => 'treated',
            'confidenceScore' => 96,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.severity', 'critical')
            ->assertJsonPath('data.detectionStatus', 'treated')
            ->assertJsonPath('data.confidenceScore', 96)
            ->assertJsonPath('data.confidence', 'High');

        $this->assertSame(1, DiseaseHistory::where('detection_id', $detection->id)->count());
        $this->assertDatabaseHas('disease_detections', [
            'id' => $detection->id,
            'severity' => 'critical',
            'detection_status' => 'treated',
        ]);
    }

    public function test_soft_delete_removes_detection_from_api_but_keeps_history(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('chilli-del-'.Str::random(6), 'Chilli', 'મરચાં');
        $detection = $this->makeDetection($user, $field, $crop);

        $this->actingAsUser($user)->deleteJson('/v1/disease/detections/'.$detection->id)
            ->assertOk()
            ->assertJsonPath('message', 'Disease detection deleted successfully.');

        $this->actingAsUser($user)->getJson('/v1/disease/detections/'.$detection->id)
            ->assertStatus(404);

        $this->assertSoftDeleted('disease_detections', ['id' => $detection->id]);
        $this->assertDatabaseHas('disease_history', ['detection_id' => (int) $detection->id]);
    }

    public function test_list_supports_field_crop_severity_status_and_date_filters(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $otherField = $this->makeField($user);
        $wheat = $this->makeCrop('wheat-list-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-list-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makeDetection($user, $field, $wheat, [
            'disease_name' => 'Rust A',
            'severity' => 'low',
            'detection_status' => 'confirmed',
            'detected_at' => '2026-07-01 09:00:00',
        ]);
        $this->makeDetection($user, $field, $cotton, [
            'disease_name' => 'Wilt B',
            'severity' => 'critical',
            'detection_status' => 'pending',
            'detected_at' => '2026-08-01 09:00:00',
        ]);
        $this->makeDetection($user, $otherField, $wheat, [
            'disease_name' => 'Rust C',
            'severity' => 'high',
            'detection_status' => 'confirmed',
            'detected_at' => '2026-08-05 09:00:00',
        ]);

        $this->actingAsUser($user)->getJson('/v1/disease/detections')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAsUser($user)->getJson('/v1/disease/detections?fieldId='.$otherField->id)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAsUser($user)->getJson('/v1/disease/detections?cropId='.$cotton->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.crop.id', (int) $cotton->id);

        $this->actingAsUser($user)->getJson('/v1/disease/detections?severity=critical')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.severity', 'critical');

        $this->actingAsUser($user)->getJson('/v1/disease/detections?status=pending')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.detectionStatus', 'pending');

        $this->actingAsUser($user)->getJson('/v1/disease/detections?from=2026-08-01&to=2026-08-31')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_history_supports_field_crop_and_date_filters(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $otherField = $this->makeField($user);
        $wheat = $this->makeCrop('wheat-hist-'.Str::random(6), 'Wheat', 'ઘઉં');
        $cotton = $this->makeCrop('cotton-hist-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makeDetection($user, $field, $wheat, [
            'disease_name' => 'Blast A',
            'detected_at' => '2026-07-10 09:00:00',
        ]);
        $this->makeDetection($user, $field, $cotton, [
            'disease_name' => 'Wilt B',
            'detected_at' => '2026-08-01 09:00:00',
        ]);
        $this->makeDetection($user, $otherField, $wheat, [
            'disease_name' => 'Blast C',
            'detected_at' => '2026-08-06 09:00:00',
        ]);

        $this->actingAsUser($user)->getJson('/v1/disease/history')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAsUser($user)->getJson('/v1/disease/history?fieldId='.$otherField->id)
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAsUser($user)->getJson('/v1/disease/history?cropId='.$cotton->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.crop.id', (int) $cotton->id);

        $this->actingAsUser($user)->getJson('/v1/disease/history?from=2026-08-01&to=2026-08-31')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_dashboard_returns_statistics_and_distributions(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('peanut-dash-'.Str::random(6), 'Groundnut', 'મગફળી');

        $this->makeDetection($user, $field, $crop, [
            'disease_name' => 'Leaf Spot',
            'severity' => 'low',
            'detection_source' => 'manual',
        ]);
        $this->makeDetection($user, $field, $crop, [
            'disease_name' => 'Leaf Spot',
            'severity' => 'critical',
            'detection_source' => 'ai',
            'detection_status' => 'pending',
        ]);
        $this->makeDetection($user, $field, $crop, [
            'disease_name' => 'Rust',
            'severity' => 'high',
            'detection_source' => 'ai',
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/disease/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.statistics.totalDetections', 3)
            ->assertJsonPath('data.statistics.activeCases', 3)
            ->assertJsonPath('data.statistics.severityDistribution.low', 1)
            ->assertJsonPath('data.statistics.severityDistribution.high', 1)
            ->assertJsonPath('data.statistics.severityDistribution.critical', 1)
            ->assertJsonPath('data.statistics.statusDistribution.confirmed', 2)
            ->assertJsonPath('data.statistics.statusDistribution.pending', 1)
            ->assertJsonPath('data.statistics.sourceDistribution.manual', 1)
            ->assertJsonPath('data.statistics.sourceDistribution.ai', 2)
            ->assertJsonPath('data.diseaseDistribution.Leaf Spot', 2)
            ->assertJsonPath('data.diseaseDistribution.Rust', 1)
            ->assertJsonCount(3, 'data.recentDetections')
            ->assertJsonCount(2, 'data.highSeverityCases');
    }

    public function test_treatment_endpoint_uses_detection_snapshot_from_knowledge_base(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('wheat-treat-'.Str::random(6), 'Wheat', 'ઘઉં');
        $disease = $this->makeDisease($crop, 'Leaf Rust-treat-'.Str::random(6), 'Leaf Rust');
        $this->makeTreatment($disease, 'high', [
            'chemical_treatments' => ['Propiconazole 25 EC @ 0.1%'],
            'organic_treatments' => ['Neem oil spray'],
            'recommended_product' => 'Propiconazole',
            'dosage' => '500 ml/ha',
        ]);

        $detection = $this->makeDetection($user, $field, $crop, [
            'disease_id' => (int) $disease->id,
            'disease_name' => 'Leaf Rust',
            'severity' => 'high',
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/disease/detections/'.$detection->id.'/treatment');

        $response->assertOk()
            ->assertJsonPath('data.detectionId', (int) $detection->id)
            ->assertJsonPath('data.source', 'detection_snapshot')
            ->assertJsonPath('data.severity', 'high')
            ->assertJsonPath('data.recommendedTreatment', 'Propiconazole — 500 ml/ha')
            ->assertJsonPath('data.organicTreatments.0', 'Neem oil spray')
            ->assertJsonPath('data.chemicalTreatments.0', 'Propiconazole 25 EC @ 0.1%');
    }

    public function test_treatment_endpoint_returns_rule_fallback_for_detection_without_disease(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('sorghum-treat-'.Str::random(6), 'Sorghum', 'જુવાર');
        $detection = $this->makeDetection($user, $field, $crop, [
            'disease_name' => 'Unknown Spot',
            'severity' => 'critical',
        ]);

        $response = $this->actingAsUser($user)->getJson('/v1/disease/detections/'.$detection->id.'/treatment');

        $response->assertOk()
            ->assertJsonPath('data.source', 'detection_snapshot')
            ->assertJsonPath('data.severity', 'critical')
            ->assertJsonStructure(['data' => ['recommendedTreatment', 'organicTreatments', 'chemicalTreatments', 'preventionTips', 'followUpAdvice']])
            ->assertJsonPath('data.recommendedTreatment', 'Consult a local agricultural extension officer or Krishi Vigyan Kendra for confirmed treatment guidance.');
    }

    public function test_treatment_endpoint_returns_404_for_unknown_detection(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->getJson('/v1/disease/detections/999999999/treatment')
            ->assertStatus(404);
    }

    public function test_farmer_can_upload_images_and_attach_them_to_a_detection(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('onion-img-'.Str::random(6), 'Onion', 'ડુંગળી');

        $upload = $this->actingAsUser($user)->post('/v1/disease/images', [
            'images' => [HttpUploadedFile::fake()->create('leaf1.jpg', 100, 'image/jpeg')],
        ]);

        $upload->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');

        $fileId = $upload->json('data.0.id');

        $this->assertDatabaseHas('uploaded_files', [
            'id' => $fileId,
            'user_id' => (int) $user->id,
            'disk' => 'local',
            'visibility' => 'private',
        ]);

        $create = $this->actingAsUser($user)->postJson('/v1/disease/detections', [
            'fieldId' => (int) $field->id,
            'cropId' => (int) $crop->id,
            'diseaseName' => 'Purple Blotch',
            'confidenceScore' => 88,
            'severity' => 'medium',
            'imageFileIds' => [$fileId],
        ]);

        $create->assertStatus(201)
            ->assertJsonPath('data.images.0.fileId', $fileId)
            ->assertJsonPath('data.images.0.isPrimary', true);

        $detectionId = $create->json('data.id');

        $this->assertDatabaseHas('disease_images', [
            'detection_id' => $detectionId,
            'file_id' => $fileId,
            'is_primary' => true,
        ]);

        $attach = $this->actingAsUser($user)->postJson('/v1/disease/detections/'.$detectionId.'/images', [
            'imageFileIds' => [$fileId],
        ]);

        $attach->assertOk()
            ->assertJsonCount(1, 'data.images');

        $this->assertSame(1, DiseaseImage::where('detection_id', $detectionId)->count());
    }

    public function test_image_upload_rejects_invalid_mime_and_oversized_files(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->post('/v1/disease/images', [
            'images' => [HttpUploadedFile::fake()->create('notes.txt', 100)],
        ])->assertStatus(422);

        $this->actingAsUser($user)->post('/v1/disease/images', [
            'images' => [HttpUploadedFile::fake()->create('huge.jpg', 6000, 'image/jpeg')],
        ])->assertStatus(422);

        $this->assertDatabaseMissing('uploaded_files', ['user_id' => (int) $user->id]);
    }

    public function test_attach_images_silently_skips_files_owned_by_others(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $field = $this->makeField($user);
        $crop = $this->makeCrop('ginger-own-'.Str::random(6), 'Ginger', 'આદુ');
        $detection = $this->makeDetection($user, $field, $crop);

        $foreignFile = UploadedFile::create([
            'user_id' => (int) $other->id,
            'disk' => 'local',
            'path' => 'disease-images/foreign.jpg',
            'original_name' => 'foreign.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);

        $this->actingAsUser($user)->postJson('/v1/disease/detections/'.$detection->id.'/images', [
            'imageFileIds' => [(int) $foreignFile->id],
        ])->assertOk()
            ->assertJsonCount(0, 'data.images');

        $this->assertDatabaseMissing('disease_images', [
            'detection_id' => (int) $detection->id,
            'file_id' => (int) $foreignFile->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeDetection(User $user, FarmerField $field, Crop $crop, array $attributes = []): DiseaseDetection
    {
        $data = [
            'disease_name' => 'Leaf Rust',
            'confidence_score' => 85,
            'severity' => 'high',
            ...$attributes,
        ];

        return app(DiseaseServiceInterface::class)
            ->createDetection((int) $user->id, (int) $field->id, (int) $crop->id, $data);
    }

    private function makeDisease(Crop $crop, string $code, string $name): Disease
    {
        return Disease::create([
            'crop_id' => (int) $crop->id,
            'code' => $code,
            'name' => $name,
            'scientific_name' => 'Puccinia triticina',
            'severity_default' => 'medium',
            'symptoms' => ['Orange pustules'],
            'preventive_measures' => ['Use resistant varieties', 'Crop rotation'],
            'chemical_treatments' => ['Propiconazole'],
            'organic_treatments' => ['Neem oil'],
            'recommended_product' => 'Propiconazole',
            'dosage' => '500 ml/ha',
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeTreatment(Disease $disease, string $severity, array $attributes = []): TreatmentRecommendation
    {
        return TreatmentRecommendation::create([
            'disease_id' => (int) $disease->id,
            'severity' => $severity,
            'chemical_treatments' => [],
            'organic_treatments' => [],
            'is_active' => true,
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

    private function actingAsUser(User $user): static
    {
        return $this->withToken($user->createToken('disease-test')->plainTextToken);
    }
}
