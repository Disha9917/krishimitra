<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthModuleTest extends TestCase
{
    use DatabaseTransactions;

    private static int $sequence = 0;

    private function uniqueEmail(string $prefix = 'auth.test'): string
    {
        return sprintf('%s.%s.%s@example.com', $prefix, time(), self::$sequence++);
    }

    private function uniquePhone(): string
    {
        return '9' . str_pad(substr((string) (time() + self::$sequence++), -9), 9, '0', STR_PAD_LEFT);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'fullName' => 'Auth Test Farmer',
            'email' => $this->uniqueEmail(),
            'phone' => $this->uniquePhone(),
            'pinCode' => '382481',
            'password' => 'Str0ng!Pass2026',
            'preferredLanguage' => 'gu',
            'role' => 'farmer',
        ], $overrides);
    }

    public function test_registration_with_valid_email_and_password_returns_201(): void
    {
        $payload = $this->validPayload();

        $response = $this->postJson('/v1/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['access_token', 'refresh_token', 'token_type', 'expires_in', 'user'],
            ])
            ->assertJsonPath('data.user.email', $payload['email']);
    }

    public function test_registration_stores_email_lowercased(): void
    {
        $payload = $this->validPayload(['email' => 'MixedCase.User@Example.COM']);

        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'mixedcase.user@example.com',
            'phone' => $payload['phone'],
        ]);
        $this->assertDatabaseMissing('users', ['email' => 'MixedCase.User@Example.COM']);
    }

    public function test_registration_stores_hashed_password_not_plaintext(): void
    {
        $payload = $this->validPayload();

        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $user = User::where('phone', $payload['phone'])->first();
        $this->assertNotNull($user);
        $this->assertNotSame($payload['password'], (string) $user->password_hash);
        $this->assertNotSame('', (string) $user->password_hash);
        $this->assertStringStartsWith('$2', (string) $user->password_hash);
        $this->assertTrue(Hash::check($payload['password'], (string) $user->password_hash));
    }

    public function test_registration_rejects_duplicate_email(): void
    {
        $this->postJson('/v1/auth/register', $this->validPayload(['email' => 'dupe@example.com']))
            ->assertStatus(201);

        $this->postJson('/v1/auth/register', $this->validPayload(['email' => 'dupe@example.com']))
            ->assertStatus(422);

        $this->postJson('/v1/auth/register', $this->validPayload(['email' => 'DUPE@Example.com']))
            ->assertStatus(422);
    }

    public function test_registration_rejects_short_password(): void
    {
        $this->postJson('/v1/auth/register', $this->validPayload(['password' => 'short1']))
            ->assertStatus(422);
    }

    public function test_registered_user_can_login_with_email_and_password(): void
    {
        $payload = $this->validPayload(['email' => 'login.flow@example.com']);

        $register = $this->postJson('/v1/auth/register', $payload)->assertStatus(201);
        $access = $register->json('data.access_token');
        $this->assertIsString($access);

        $this->withToken($access)->postJson('/v1/auth/logout')->assertStatus(200);

        $login = $this->postJson('/v1/auth/login', [
            'identifier' => 'login.flow@example.com',
            'password' => $payload['password'],
        ])->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['access_token', 'refresh_token', 'token_type', 'expires_in', 'user'],
            ]);

        $this->assertSame('login.flow@example.com', $login->json('data.user.email'));
    }

    public function test_login_rejects_wrong_password(): void
    {
        $payload = $this->validPayload(['email' => 'wrong.pass@example.com']);
        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $this->postJson('/v1/auth/login', [
            'identifier' => 'wrong.pass@example.com',
            'password' => 'WrongPass2026!',
        ])->assertStatus(422);
    }

    public function test_email_login_is_case_insensitive(): void
    {
        $payload = $this->validPayload(['email' => 'Case.User@Example.com']);
        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        foreach (['case.user@example.com', 'CASE.USER@EXAMPLE.COM', '  case.user@example.com  '] as $identifier) {
            $this->postJson('/v1/auth/login', [
                'identifier' => $identifier,
                'password' => $payload['password'],
            ])->assertStatus(200);
        }
    }

    public function test_me_returns_authenticated_user_after_login(): void
    {
        $payload = $this->validPayload(['email' => 'me.flow@example.com']);

        $register = $this->postJson('/v1/auth/register', $payload)->assertStatus(201);
        $access = $register->json('data.access_token');

        $this->withToken($access)->getJson('/v1/auth/me')
            ->assertStatus(200)
            ->assertJsonPath('data.email', 'me.flow@example.com')
            ->assertJsonPath('data.fullName', $payload['fullName']);
    }

    public function test_logout_revokes_access_token(): void
    {
        $payload = $this->validPayload(['email' => 'logout.flow@example.com']);

        $register = $this->postJson('/v1/auth/register', $payload)->assertStatus(201);
        $access = $register->json('data.access_token');

        $this->withToken($access)->postJson('/v1/auth/logout')->assertStatus(200);

        // The auth guard caches the resolved user inside the test container; drop it
        // so the next request resolves the (now revoked) token from the database.
        $this->app->make('auth')->forgetGuards();

        $this->withToken($access)->getJson('/v1/auth/me')->assertStatus(401);
    }

    public function test_registration_still_issues_register_otp(): void
    {
        $payload = $this->validPayload();

        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $user = User::where('phone', $payload['phone'])->first();
        $this->assertNotNull($user);
        $this->assertDatabaseHas('otps', [
            'user_id' => $user->id,
            'destination' => $payload['phone'],
            'purpose' => 'register',
        ]);
    }

    public function test_request_otp_for_login_purpose_still_creates_pending_otp(): void
    {
        $payload = $this->validPayload(['email' => 'otp.login@example.com']);
        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $this->postJson('/v1/auth/request-otp', [
            'identifier' => 'otp.login@example.com',
            'channel' => 'sms',
            'purpose' => 'login',
        ])->assertStatus(200);

        $this->assertDatabaseHas('otps', [
            'destination' => 'otp.login@example.com',
            'purpose' => 'login',
        ]);
    }

    public function test_login_with_incorrect_otp_is_rejected(): void
    {
        $payload = $this->validPayload(['email' => 'otp.wrong@example.com']);
        $this->postJson('/v1/auth/register', $payload)->assertStatus(201);

        $this->postJson('/v1/auth/request-otp', [
            'identifier' => 'otp.wrong@example.com',
            'channel' => 'sms',
            'purpose' => 'login',
        ])->assertStatus(200);

        $this->postJson('/v1/auth/login', [
            'identifier' => 'otp.wrong@example.com',
            'otp' => '000000',
        ])->assertStatus(422);
    }
}
