<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // The auth rate limiter persists in the configured cache store; reset
        // it so tests stay deterministic regardless of the cache driver used.
        Cache::flush();
    }

    private function makeUser(array $overrides = []): User
    {
        return User::create(array_merge([
            'full_name' => 'Test Farmer',
            'phone' => '9876543210',
            'email' => 'farmer@example.com',
            'password_hash' => Hash::make('Farmer2026#'),
            'phone_verified_at' => now(),
            'preferred_language' => 'en',
            'is_active' => true,
        ], $overrides));
    }

    private function makeLoginOtp(string $phone, string $code = '123456'): void
    {
        OtpCode::create([
            'user_id' => User::where('phone', $phone)->value('id'),
            'channel' => 'sms',
            'destination' => $phone,
            'code_hash' => Hash::make($code),
            'purpose' => 'login',
            'expires_at' => now()->addMinutes(10),
            'attempts' => 0,
            'consumed_at' => null,
        ]);
    }

    public function test_password_login_without_otp_succeeds(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'Farmer2026#',
        ])->assertOk()
            ->assertJsonPath('data.token_type', 'Bearer')
            ->assertJsonStructure(['data' => ['access_token', 'refresh_token', 'user']]);
    }

    public function test_password_login_ignores_a_stale_otp_field(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'Farmer2026#',
            'otp' => '55819',
        ])->assertOk();
    }

    public function test_password_login_with_wrong_password_fails(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'WrongPass1#',
        ])->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_password_login_without_password_returns_validation_error(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_otp_login_with_valid_six_digit_otp_succeeds(): void
    {
        $user = $this->makeUser();
        $this->makeLoginOtp($user->phone, '123456');

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'otp' => '123456',
        ])->assertOk()
            ->assertJsonStructure(['data' => ['access_token', 'refresh_token']]);
    }

    public function test_otp_login_with_invalid_otp_fails(): void
    {
        $user = $this->makeUser();
        $this->makeLoginOtp($user->phone, '123456');

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'otp' => '654321',
        ])->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_otp_login_with_short_otp_returns_validation_error(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'otp' => '55819',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('otp');
    }

    public function test_missing_otp_for_otp_mode_returns_validation_error(): void
    {
        $this->makeUser();

        $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'otp' => '',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_me_after_successful_login(): void
    {
        $this->makeUser();

        $token = $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'Farmer2026#',
        ])->json('data.access_token');

        $this->withToken($token)
            ->getJson('/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.phone', '9876543210')
            ->assertJsonPath('data.fullName', 'Test Farmer');
    }

    public function test_refresh_token_issues_new_token_pair(): void
    {
        $this->makeUser();

        $login = $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'Farmer2026#',
        ])->assertOk();

        $this->postJson('/v1/auth/refresh', [
            'refresh_token' => $login->json('data.refresh_token'),
        ])->assertOk()
            ->assertJsonStructure(['data' => ['access_token', 'refresh_token']]);
    }

    public function test_logout_revokes_access_token(): void
    {
        $this->makeUser();

        $token = $this->postJson('/v1/auth/login', [
            'identifier' => '9876543210',
            'password' => 'Farmer2026#',
        ])->json('data.access_token');

        $this->withToken($token)
            ->postJson('/v1/auth/logout')
            ->assertOk();

        // Drop the guard's cached user so the revoked token is re-validated.
        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/v1/auth/me')
            ->assertStatus(401);
    }
}
