<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Services\AIAdvisory\Contracts\AIProviderInterface;
use App\Services\AIAdvisory\Contracts\PromptBuilderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class AIAdvisoryModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->postJson('/v1/ai/advisory', [])->assertUnauthorized();
        $this->getJson('/v1/ai/history')->assertUnauthorized();
        $this->getJson('/v1/ai/providers')->assertUnauthorized();
    }

    public function test_providers_endpoint_lists_registered_providers(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/providers')->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.key', 'null')
            ->assertJsonPath('data.0.active', true)
            ->assertJsonPath('data.1.key', 'gemini')
            ->assertJsonPath('data.1.active', false);
    }

    public function test_advisory_returns_placeholder_response(): void
    {
        $user = $this->makeUser();
        $topic = 'Best fertilizer for wheat in north Gujarat';

        $response = $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => $topic,
            'advisory_type' => 'crop',
            'context' => ['crop' => 'wheat', 'season' => 'rabi'],
            'locale' => 'en',
        ])->assertCreated();

        $response->assertJsonPath('data.provider', 'null')
            ->assertJsonPath('data.model', 'krishimitra-null-v1')
            ->assertJsonPath('data.usage.totalTokens', 0);

        $this->assertStringContainsString($topic, $response->json('data.content'));
    }

    public function test_advisory_responds_in_gujarati_locale(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'ઘઉં માટે ખાતર',
            'locale' => 'gu',
        ])->assertCreated();

        $response->assertJsonPath('data.provider', 'null')
            ->assertJsonPath('data.model', 'krishimitra-null-v1');

        $this->assertNotEmpty($response->json('data.content'));
    }

    public function test_advisory_validates_topic_locale_and_context(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'advisory_type' => 'crop',
        ])->assertStatus(422);

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Water management',
            'locale' => 'fr',
        ])->assertStatus(422);

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Water management',
            'context' => 'not-an-array',
        ])->assertStatus(422);
    }

    public function test_history_is_scoped_per_user_and_filterable(): void
    {
        $userA = $this->makeUser();
        $userB = $this->makeUser();
        $typeA = 'TYPE-'.Str::random(6);
        $typeB = 'TYPE-'.Str::random(6);

        $this->requestAdvisory($userA, 'First advisory', $typeA);
        $this->requestAdvisory($userA, 'Second advisory', $typeA);
        $this->requestAdvisory($userA, 'Market advisory', $typeB);
        $this->requestAdvisory($userB, "Other user's advisory", $typeA);

        $this->actingAs($userA, 'sanctum')->getJson('/v1/ai/history')->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.topic', 'Market advisory')
            ->assertJsonPath('data.2.topic', 'First advisory');

        $this->actingAs($userA, 'sanctum')->getJson('/v1/ai/history?advisory_type='.$typeA)->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.advisoryType', $typeA);

        $this->actingAs($userB, 'sanctum')->getJson('/v1/ai/history')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.topic', "Other user's advisory");
    }

    public function test_history_validates_limit(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?limit=0')->assertStatus(422);
        $this->actingAs($user, 'sanctum')->getJson('/v1/ai/history?limit=101')->assertStatus(422);
    }

    public function test_provider_is_swappable_without_controller_changes(): void
    {
        $user = $this->makeUser();

        $fake = new class implements AIProviderInterface
        {
            public string $receivedPrompt = '';

            public function name(): string
            {
                return 'fake-test';
            }

            public function label(): string
            {
                return 'Fake Test Provider';
            }

            public function model(): string
            {
                return 'fake-model-v9';
            }

            public function generate(string $prompt, AdvisoryContextDTO $context): AdvisoryResponseDTO
            {
                $this->receivedPrompt = $prompt;

                return AdvisoryResponseDTO::placeholder('fake-test', 'fake-model-v9', 'Fake generated advice.');
            }
        };

        $this->app->bind(AIProviderInterface::class, static fn (): AIProviderInterface => $fake);

        $topic = 'Irrigation scheduling';

        $response = $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => $topic,
            'advisory_type' => 'irrigation',
        ])->assertCreated();

        $response->assertJsonPath('data.provider', 'fake-test')
            ->assertJsonPath('data.model', 'fake-model-v9');

        $this->assertStringContainsString('Fake generated advice.', $response->json('data.content'));
        $this->assertStringContainsString($topic, $fake->receivedPrompt);
    }

    public function test_prompt_builder_assembles_structured_context_only(): void
    {
        $builder = app(PromptBuilderInterface::class);

        $context = new AdvisoryContextDTO(
            topic: 'Wheat sowing window',
            advisoryType: 'crop',
            locale: 'en',
            sections: ['weather' => ['temperature' => 28, 'humidity' => 60]],
        );

        $prompt = $builder->build($context);

        $this->assertStringContainsString('Wheat sowing window', $prompt);
        $this->assertStringContainsString('weather', $prompt);
        $this->assertStringContainsString('temperature: 28', $prompt);
    }

    public function test_prompt_builder_demands_structured_json_only(): void
    {
        $builder = app(PromptBuilderInterface::class);

        $context = new AdvisoryContextDTO(
            topic: 'Cotton pest control',
            advisoryType: 'disease',
            locale: 'en',
            sections: [],
        );

        $prompt = $builder->build($context);

        $this->assertStringContainsString('## Strict JSON Output Contract', $prompt);
        $this->assertStringContainsString('Return ONLY one valid JSON object', $prompt);
        $this->assertStringContainsString('"sevenDayPlan"', $prompt);
        $this->assertStringContainsString('"recommendations"', $prompt);
        $this->assertStringContainsString('"priorityTasks"', $prompt);
        $this->assertStringContainsString('"avoid"', $prompt);
        $this->assertStringContainsString('"riskLevel"', $prompt);
        $this->assertStringContainsString('"confidence"', $prompt);
        foreach (['weather', 'soil', 'crop', 'disease', 'market', 'schemes', 'equipment', 'storage', 'transport'] as $module) {
            $this->assertStringContainsString('"'.$module.'":', $prompt);
        }
        $this->assertStringNotContainsString('numbered recommendation list', $prompt);
    }

    private function requestAdvisory(User $user, string $topic, string $type): void
    {
        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => $topic,
            'advisory_type' => $type,
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'null');
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
