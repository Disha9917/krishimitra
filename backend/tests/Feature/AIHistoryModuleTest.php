<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\AiAdvisory;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AIHistoryModuleTest extends TestCase
{
    use WithFaker;

    public function test_history_list_is_owned_scoped_and_filtered(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();

        $mine = $this->makeAdvisory($user, topic: 'Wheat irrigation plan', provider: 'gemini', riskLevel: 'Medium', createdAt: '2026-08-01 10:00:00');
        $this->makeAdvisory($user, topic: 'Cotton pest spray', provider: 'null', riskLevel: 'High', createdAt: '2026-08-03 10:00:00');
        $this->makeAdvisory($other, topic: "Other user's advisory", provider: 'gemini', riskLevel: 'Low');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.topic', 'Cotton pest spray')
            ->assertJsonPath('data.1.topic', 'Wheat irrigation plan')
            ->assertJsonMissingPath('data.2');
    }

    public function test_history_filters_by_risk_level_and_provider(): void
    {
        $user = $this->makeUser();

        $this->makeAdvisory($user, topic: 'A', provider: 'gemini', riskLevel: 'Low');
        $this->makeAdvisory($user, topic: 'B', provider: 'gemini', riskLevel: 'High');
        $this->makeAdvisory($user, topic: 'C', provider: 'null', riskLevel: 'High');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?risk_level=High')->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?risk_level=High&provider=gemini')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.topic', 'B');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?risk_level=low')->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_history_filters_by_date_range(): void
    {
        $user = $this->makeUser();

        $this->makeAdvisory($user, topic: 'Old', createdAt: '2026-07-01 10:00:00');
        $this->makeAdvisory($user, topic: 'Mid', createdAt: '2026-08-01 10:00:00');
        $this->makeAdvisory($user, topic: 'New', createdAt: '2026-08-05 10:00:00');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?from=2026-08-01&to=2026-08-03')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.topic', 'Mid');
    }

    public function test_history_filters_by_keyword_and_crop_context(): void
    {
        $user = $this->makeUser();

        $this->makeAdvisory($user, topic: 'Wheat irrigation', context: ['crop' => 'wheat', 'season' => 'rabi']);
        $this->makeAdvisory($user, topic: 'Cotton pest', context: ['crop' => 'cotton', 'field_id' => 42]);

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?keyword=wheat')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.topic', 'Wheat irrigation');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?crop=cotton')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.topic', 'Cotton pest');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?field=42')->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_history_respects_limit(): void
    {
        $user = $this->makeUser();

        $this->makeAdvisory($user, topic: 'One');
        $this->makeAdvisory($user, topic: 'Two');

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?limit=1')->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_show_returns_own_advisory_and_rejects_foreign(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $advisory = $this->makeAdvisory($user, topic: 'My wheat plan', provider: 'gemini', riskLevel: 'High');

        $response = $this->actingAs($user, 'sanctum')->getJson("/v1/ai/history/{$advisory->id}")->assertOk()
            ->assertJsonPath('data.id', $advisory->id)
            ->assertJsonPath('data.topic', 'My wheat plan')
            ->assertJsonPath('data.provider', 'gemini')
            ->assertJsonPath('data.riskLevel', 'High')
            ->assertJsonPath('data.isFavorite', false);

        $this->assertArrayHasKey('contextSnapshot', $response->json('data'));
        $this->assertArrayHasKey('usage', $response->json('data'));

        $this->actingAs($other, 'sanctum')->getJson("/v1/ai/history/{$advisory->id}")->assertStatus(404);
        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history/999999')->assertStatus(404);
    }

    public function test_destroy_soft_deletes_and_removes_from_listing(): void
    {
        $user = $this->makeUser();
        $advisory = $this->makeAdvisory($user, topic: 'To delete');

        $this->actingAs($user, 'sanctum')->deleteJson("/v1/ai/history/{$advisory->id}")->assertOk();

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history')->assertOk()->assertJsonCount(0, 'data');
        $this->actingAs($user, 'sanctum')->getJson("/v1/ai/history/{$advisory->id}")->assertStatus(404);

        $this->assertSoftDeleted('ai_advisories', ['id' => $advisory->id]);
    }

    public function test_destroy_rejects_foreign_advisory(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $advisory = $this->makeAdvisory($user);

        $this->actingAs($other, 'sanctum')->deleteJson("/v1/ai/history/{$advisory->id}")->assertStatus(404);
        $this->assertDatabaseHas('ai_advisories', ['id' => $advisory->id, 'deleted_at' => null]);
    }

    public function test_favorite_is_idempotent_and_listed(): void
    {
        $user = $this->makeUser();
        $advisory = $this->makeAdvisory($user, topic: 'Favorite me');

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/favorite")->assertOk()
            ->assertJsonPath('data.isFavorite', true);

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/favorite")->assertOk()
            ->assertJsonPath('data.isFavorite', true);

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/favorites')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $advisory->id);

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?favorites=true')->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_unfavorite_removes_from_favorites(): void
    {
        $user = $this->makeUser();
        $advisory = $this->makeAdvisory($user);

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/favorite")->assertOk();
        $this->actingAs($user, 'sanctum')->deleteJson("/v1/ai/history/{$advisory->id}/favorite")->assertOk()
            ->assertJsonPath('data.isFavorite', false);

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/favorites')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_favorite_rejects_foreign_advisory(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $advisory = $this->makeAdvisory($user);

        $this->actingAs($other, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/favorite")->assertStatus(404);
    }

    public function test_feedback_is_created_then_updated_on_one_advisory(): void
    {
        $user = $this->makeUser();
        $advisory = $this->makeAdvisory($user, topic: 'Give feedback');

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'rating' => 4,
            'helpful' => true,
            'comment' => 'Very useful for my wheat crop.',
        ])->assertOk()
            ->assertJsonPath('data.advisoryId', $advisory->id)
            ->assertJsonPath('data.rating', 4)
            ->assertJsonPath('data.helpful', true)
            ->assertJsonPath('data.comment', 'Very useful for my wheat crop.');

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'rating' => 5,
            'helpful' => false,
            'comment' => 'Updated after trying the advice.',
        ])->assertOk()
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.helpful', false);

        $this->assertDatabaseHas('ai_advisories', [
            'id' => $advisory->id,
            'rating' => 5,
            'helpful' => false,
            'feedback_comment' => 'Updated after trying the advice.',
        ]);
    }

    public function test_feedback_validates_rating_range(): void
    {
        $user = $this->makeUser();
        $advisory = $this->makeAdvisory($user);

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'rating' => 6,
            'helpful' => true,
        ])->assertStatus(422);

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'rating' => 0,
            'helpful' => true,
        ])->assertStatus(422);

        $this->actingAs($user, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'helpful' => true,
        ])->assertStatus(422);
    }

    public function test_feedback_rejects_foreign_advisory(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $advisory = $this->makeAdvisory($user);

        $this->actingAs($other, 'sanctum')->postJson("/v1/ai/history/{$advisory->id}/feedback", [
            'rating' => 3,
            'helpful' => true,
        ])->assertStatus(404);
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/ai/history')->assertUnauthorized();
        $this->getJson('/v1/ai/history/1')->assertUnauthorized();
        $this->deleteJson('/v1/ai/history/1')->assertUnauthorized();
        $this->postJson('/v1/ai/history/1/favorite')->assertUnauthorized();
        $this->deleteJson('/v1/ai/history/1/favorite')->assertUnauthorized();
        $this->getJson('/v1/ai/favorites')->assertUnauthorized();
        $this->postJson('/v1/ai/history/1/feedback', ['rating' => 5, 'helpful' => true])->assertUnauthorized();
    }

    private function makeAdvisory(
        User $user,
        string $topic = 'Default advisory',
        string $provider = 'null',
        string $riskLevel = 'Low',
        array $context = ['crop' => 'wheat'],
        ?string $createdAt = null,
    ): AiAdvisory {
        return AiAdvisory::create([
            'user_id' => $user->id,
            'advisory_type' => 'crop',
            'topic' => $topic,
            'input_snapshot' => ['topic' => $topic, 'advisory_type' => 'crop', 'context' => $context, 'locale' => 'en'],
            'context_snapshot' => $context,
            'top3_advisories' => [],
            'irrigation_plan' => [],
            'fertilizer_plan' => [],
            'pest_alert' => [],
            'timeline_7_days' => [],
            'provider' => $provider,
            'model_version' => 'test-model-v1',
            'risk_level' => $riskLevel,
            'prompt_text' => 'Structured prompt for '.$topic,
            'response_content' => '{"summary":"Advice for '.$topic.'"}',
            'usage' => ['input_tokens' => 100, 'output_tokens' => 50, 'total_tokens' => 150],
            'latency_ms' => 1200,
            'generated_at' => $createdAt !== null ? $createdAt : now(),
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
}
