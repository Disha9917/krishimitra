<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\AiAdvisory;
use App\Models\User;
use App\Services\AIAdvisory\Providers\Gemini\Exceptions\GeminiException;
use App\Services\AIAdvisory\Providers\Gemini\Exceptions\RetryableGeminiException;
use App\Services\AIAdvisory\Providers\Gemini\ResponseParser;
use App\Services\AIAdvisory\Providers\Gemini\RetryHandler;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiProviderModuleTest extends TestCase
{
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->activateGemini();
    }

    public function test_valid_response_is_parsed_and_advisory_is_stored(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->apiResponse([
                'text' => '{"summary":"Water your wheat crop in the evening.","riskLevel":"Medium","confidence":0.85,'
                    .'"recommendations":[{"title":"Evening irrigation","description":"Irrigate after 6 pm to cut evaporation loss.","priority":"High","category":"Weather"}],'
                    .'"alerts":[],"bestMarket":{},"eligibleSchemes":[],"nextReviewDate":"2026-08-16"}',
            ])),
        ]);

        $user = $this->makeUser();
        $topic = 'Irrigation plan for wheat';

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => $topic,
            'advisory_type' => 'irrigation',
            'context' => ['crop' => 'wheat'],
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini')
            ->assertJsonPath('data.model', 'gemini-3.5-flash')
            ->assertJsonPath('data.usage.totalTokens', 460);

        Http::assertSentCount(1);
        Http::assertSent(fn ($request): bool => str_contains($request->url(), 'gemini-3.5-flash:generateContent'));

        $advisory = AiAdvisory::where('user_id', $user->id)->latest('id')->first();

        $this->assertNotNull($advisory);
        $this->assertSame('gemini', $advisory->provider);
        $this->assertSame('gemini-3.5-flash', $advisory->model_version);
        $this->assertStringContainsString($topic, $advisory->prompt_text);
        $this->assertStringContainsString('## Structured Context', $advisory->prompt_text);
        $this->assertStringContainsString('"summary"', $advisory->response_content);
        $this->assertStringContainsString('Water your wheat crop', $advisory->response_content);
        $this->assertSame(120, $advisory->usage['prompt_token_count']);
        $this->assertSame(340, $advisory->usage['candidates_token_count']);
        $this->assertSame(460, $advisory->usage['total_tokens']);
        $this->assertGreaterThanOrEqual(0, $advisory->latency_ms);
        $this->assertNotNull($advisory->generated_at);
    }

    public function test_transient_429_is_retried_then_succeeds(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::sequence()
                ->push(['error' => ['code' => 429, 'message' => 'Quota exceeded']], 429)
                ->push($this->apiResponse(['text' => '{"summary":"Retried successfully.","riskLevel":"Low","confidence":0.9,"recommendations":[]}'])),
        ]);

        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Retry test',
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini');

        Http::assertSentCount(2);

        $advisory = AiAdvisory::where('user_id', $user->id)->latest('id')->first();
        $this->assertStringContainsString('Retried successfully.', $advisory->response_content);
    }

    public function test_malformed_json_is_retried_once_then_falls_back(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->apiResponse([
                'text' => 'Here is some advice: irrigate in the morning.',
            ])),
        ]);

        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Malformed output test',
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini');

        Http::assertSentCount(2);

        $advisory = AiAdvisory::where('user_id', $user->id)->latest('id')->first();
        $this->assertStringContainsString('temporarily unavailable', $advisory->response_content);
        $this->assertSame(0, $advisory->usage['input_tokens']);
    }

    public function test_network_failure_falls_back_without_crashing(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => fn () => throw new ConnectionException('Connection timed out'),
        ]);

        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Network failure test',
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini');

        $advisory = AiAdvisory::where('user_id', $user->id)->latest('id')->first();
        $this->assertStringContainsString('temporarily unavailable', $advisory->response_content);
    }

    public function test_non_retryable_api_error_falls_back_immediately(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => ['code' => 400, 'message' => 'Bad request']], 400),
        ]);

        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Bad request test',
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini');

        Http::assertSentCount(1);

        $advisory = AiAdvisory::where('user_id', $user->id)->latest('id')->first();
        $this->assertStringContainsString('temporarily unavailable', $advisory->response_content);
    }

    public function test_missing_api_key_falls_back_without_any_http_call(): void
    {
        config(['ai.gemini.api_key' => '']);

        $user = $this->makeUser();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'No key test',
        ])->assertCreated()
            ->assertJsonPath('data.provider', 'gemini')
            ->assertJsonPath('data.usage.totalTokens', 0);

        Http::assertNothingSent();
    }

    public function test_response_parser_validates_and_normalizes_payload(): void
    {
        $parser = app(ResponseParser::class);

        $this->assertNotNull($parser->parse('{"summary":"s","riskLevel":"High","confidence":0.5,"recommendations":[{"title":"t","description":"d","priority":"High","category":"Market"}]}'));
        $this->assertNotNull($parser->parse("```json\n{\"summary\":\"fenced\",\"riskLevel\":\"Low\"}\n```"));

        $this->assertNull($parser->parse('not json at all'));
        $this->assertNull($parser->parse(''));
        $this->assertNull($parser->parse('[1,2,3]'));

        $coerced = $parser->parse('{"summary":"x","riskLevel":"Extreme","confidence":5,"recommendations":[{"title":"t"}],"bestMarket":{"name":"Unjha Mandi"},"eligibleSchemes":[{"code":"PM-KISAN"}]}');
        $this->assertIsArray($coerced);
        $this->assertSame('Low', $coerced['riskLevel']);
        $this->assertSame(1.0, $coerced['confidence']);
        $this->assertSame('Medium', $coerced['recommendations'][0]['priority']);
        $this->assertSame('Crop', $coerced['recommendations'][0]['category']);
        $this->assertSame('Unjha Mandi', $coerced['bestMarket']['name']);
        $this->assertSame('PM-KISAN', $coerced['eligibleSchemes'][0]['code']);
    }

    public function test_retry_handler_retries_null_results_and_transient_errors(): void
    {
        $handler = new RetryHandler(maxAttempts: 3, baseDelayMs: 1);

        $attempts = 0;
        $result = $handler->retry(function () use (&$attempts): ?string {
            $attempts++;

            return $attempts < 3 ? null : 'ok';
        });

        $this->assertSame('ok', $result);
        $this->assertSame(3, $handler->attemptsUsed());

        $attempts = 0;
        $result = $handler->retry(function () use (&$attempts): ?string {
            $attempts++;

            if ($attempts === 1) {
                throw new RetryableGeminiException('quota');
            }

            return 'recovered';
        });

        $this->assertSame('recovered', $result);
        $this->assertSame(2, $handler->attemptsUsed());

        $exhausted = false;

        try {
            $handler->retry(fn (): ?string => throw new RetryableGeminiException('always busy'));
        } catch (RetryableGeminiException) {
            $exhausted = true;
        }

        $this->assertTrue($exhausted);
        $this->assertSame(3, $handler->attemptsUsed());
    }

    public function test_retry_handler_never_retries_non_retryable_errors(): void
    {
        $handler = new RetryHandler(maxAttempts: 3, baseDelayMs: 1);

        $this->expectException(GeminiException::class);

        try {
            $handler->retry(fn (): mixed => throw new GeminiException('invalid api key', 403));
        } finally {
            $this->assertSame(1, $handler->attemptsUsed());
        }
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function apiResponse(array $overrides = []): array
    {
        $text = (string) ($overrides['text'] ?? '{"summary":"ok"}');

        return [
            'candidates' => [
                ['content' => ['parts' => [['text' => $text]]], 'finishReason' => 'STOP'],
            ],
            'usageMetadata' => [
                'promptTokenCount' => 120,
                'candidatesTokenCount' => 340,
                'totalTokenCount' => 460,
            ],
        ];
    }

    private function activateGemini(): void
    {
        config([
            'ai.provider' => 'gemini',
            'ai.gemini.api_key' => 'test-api-key',
            'ai.gemini.model' => 'gemini-3.5-flash',
            'ai.gemini.retry_max_attempts' => 2,
            'ai.gemini.retry_base_delay_ms' => 1,
            'ai.gemini.timeout' => 5,
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
