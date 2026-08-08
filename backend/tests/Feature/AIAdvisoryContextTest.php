<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\FarmerField;
use App\Models\User;
use App\Services\AIAdvisory\Contracts\AIProviderInterface;
use App\Services\AIAdvisory\Contracts\PromptBuilderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use App\Services\Market\MarketServiceInterface;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class AIAdvisoryContextTest extends TestCase
{
    use WithFaker;

    public function test_context_engine_populates_all_module_sections(): void
    {
        $user = $this->makeUser();
        $captured = $this->capturingProvider();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Fertilizer advice for my farm',
            'advisory_type' => 'crop',
            'context' => ['crop' => 'wheat'],
        ])->assertCreated();

        $sections = $captured->context->sections;

        foreach (['profile', 'weather', 'soil', 'crop', 'disease', 'market', 'governmentSchemes', 'equipment', 'coldStorage', 'transport', 'dashboard'] as $section) {
            $this->assertArrayHasKey($section, $sections, "Missing context section: {$section}");
            $this->assertIsArray($sections[$section]);
        }

        $this->assertSame('wheat', $sections['crop']['requested']['value']);
        $this->assertArrayHasKey('summary', $sections['crop'], 'Engine crop data must replace the hint');
        $this->assertFalse($sections['weather']['available']);
        $this->assertSame([], $sections['profile']['fields']);
        $this->assertArrayHasKey('statistics', $sections['dashboard']);
    }

    public function test_context_engine_uses_request_location_for_weather(): void
    {
        $user = $this->makeUser();
        $captured = $this->capturingProvider();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Weather based irrigation plan',
            'advisory_type' => 'irrigation',
            'context' => ['lat' => 23.0225, 'lng' => 72.5714, 'district_id' => 1],
        ])->assertCreated();

        $weather = $captured->context->sections['weather'];

        $this->assertTrue($weather['available']);
        $this->assertSame(23.0225, $weather['lat']);
        $this->assertSame(72.5714, $weather['lng']);
        $this->assertSame(1, $weather['district_id']);
        $this->assertArrayHasKey('location_key', $weather);
        $this->assertArrayHasKey('current', $weather);
        $this->assertArrayHasKey('today_forecast', $weather);
        $this->assertArrayHasKey('active_alerts', $weather);
        $this->assertSame([], $weather['active_alerts']);
    }

    public function test_context_engine_uses_farmer_field_location_when_request_has_none(): void
    {
        $user = $this->makeUser();
        $captured = $this->capturingProvider();

        FarmerField::create([
            'user_id' => $user->id,
            'name' => 'Home plot',
            'size_acres' => 2.5,
            'lat' => 22.30,
            'lng' => 70.80,
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Sowing window for cotton',
            'advisory_type' => 'crop',
        ])->assertCreated();

        $weather = $captured->context->sections['weather'];

        $this->assertTrue($weather['available']);
        $this->assertSame(22.30, $weather['lat']);
        $this->assertSame(70.80, $weather['lng']);
        $this->assertSame(1, count($captured->context->sections['profile']['fields']));
    }

    public function test_context_engine_degrades_gracefully_when_a_module_fails(): void
    {
        $user = $this->makeUser();

        $broken = Mockery::mock(MarketServiceInterface::class);
        $broken->shouldReceive('marketDashboard')->andThrow(new RuntimeException('provider outage'));
        $this->app->instance(MarketServiceInterface::class, $broken);

        $captured = $this->capturingProvider();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Market prices for wheat',
            'advisory_type' => 'market',
        ])->assertCreated();

        $sections = $captured->context->sections;

        $this->assertArrayHasKey('market', $sections);
        $this->assertFalse($sections['market']['available']);
        $this->assertArrayHasKey('reason', $sections['market']);
        $this->assertArrayHasKey('soil', $sections, 'Other sections must still be collected');
        $this->assertArrayHasKey('dashboard', $sections, 'Other sections must still be collected');
    }

    public function test_context_engine_can_be_disabled_via_config(): void
    {
        config(['ai.context_enabled' => false]);

        $user = $this->makeUser();
        $captured = $this->capturingProvider();

        $this->actingAs($user, 'sanctum')->postJson('/v1/ai/advisory', [
            'topic' => 'Quick question',
            'advisory_type' => 'general',
            'context' => ['crop' => 'wheat'],
        ])->assertCreated();

        $this->assertSame(['crop' => ['value' => 'wheat']], $captured->context->sections);
    }

    public function test_prompt_builder_renders_nested_section_values(): void
    {
        $builder = app(PromptBuilderInterface::class);

        $context = new AdvisoryContextDTO(
            topic: 'Soil health',
            advisoryType: 'soil',
            locale: 'en',
            sections: [
                'soil' => [
                    'summary' => ['health_score' => 72, 'status' => 'Good'],
                    'alerts' => [['type' => 'low_potassium', 'level' => 'warning']],
                    'empty' => [],
                    'flag' => true,
                ],
            ],
        );

        $prompt = $builder->build($context);

        $this->assertStringContainsString('### soil', $prompt);
        $this->assertStringContainsString('- summary:', $prompt);
        $this->assertStringContainsString('health_score: 72', $prompt);
        $this->assertStringContainsString('status: Good', $prompt);
        $this->assertStringContainsString('type: low_potassium', $prompt);
        $this->assertStringContainsString('level: warning', $prompt);
        $this->assertStringContainsString('- empty: []', $prompt);
        $this->assertStringContainsString('flag: true', $prompt);
    }

    /**
     * Replace the active provider with one that records the assembled
     * context and prompt so tests can inspect the engine output.
     */
    private function capturingProvider(): object
    {
        $captured = new class
        {
            public ?AdvisoryContextDTO $context = null;

            public string $prompt = '';
        };

        $provider = new class($captured) implements AIProviderInterface
        {
            public function __construct(public readonly object $captured) {}

            public function name(): string
            {
                return 'capture-test';
            }

            public function label(): string
            {
                return 'Capture Test Provider';
            }

            public function model(): string
            {
                return 'capture-model-v1';
            }

            public function generate(string $prompt, AdvisoryContextDTO $context): AdvisoryResponseDTO
            {
                $this->captured->context = $context;
                $this->captured->prompt = $prompt;

                return AdvisoryResponseDTO::placeholder('capture-test', 'capture-model-v1', 'Captured.');
            }
        };

        $this->app->bind(AIProviderInterface::class, static fn (): AIProviderInterface => $provider);

        return $captured;
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
