<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;
use App\Repositories\Contracts\OtpCodeRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\UserRoleRepositoryInterface;
use DomainException;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;
use Laravel\Sanctum\Sanctum;

class AuthService implements AuthServiceInterface
{
    private const OTP_TTL_MINUTES = 10;

    private const OTP_MAX_ATTEMPTS = 5;

    private const OTP_LENGTH = 6;

    private const ACCESS_TTL_MINUTES = 60;

    private const REFRESH_TTL_DAYS = 7;

    public function __construct(
        private readonly OtpCodeRepositoryInterface $otps,
        private readonly UserRepositoryInterface $users,
        private readonly FarmerProfileRepositoryInterface $profiles,
        private readonly RoleRepositoryInterface $roles,
        private readonly UserRoleRepositoryInterface $userRoles,
    ) {
    }

    public function requestOtp(string $destination, string $channel, string $purpose, ?int $userId = null): void
    {
        $pending = $this->otps->findPendingByDestination($destination, $purpose);

        if ($pending !== null) {
            throw new DomainException('An OTP has already been issued. Please wait before requesting a new one.');
        }

        if ($userId === null) {
            $user = $this->users->findByIdentifier($destination);
            $userId = $user !== null ? (int) $user->id : null;
        }

        $code = (string) random_int(10 ** (self::OTP_LENGTH - 1), (10 ** self::OTP_LENGTH) - 1);

        $this->otps->create([
            'user_id' => $userId,
            'channel' => strtolower($channel),
            'destination' => $destination,
            'code_hash' => Hash::make($code),
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES),
            'attempts' => 0,
            'consumed_at' => null,
        ]);
    }

    public function verifyOtp(string $destination, string $purpose, string $code): bool
    {
        $otp = $this->otps->findPendingByDestination($destination, $purpose);

        if ($otp === null) {
            throw new InvalidArgumentException('No pending OTP found for the given destination.');
        }

        if ($otp->expires_at !== null && $otp->expires_at->isPast()) {
            throw new DomainException('The OTP has expired. Please request a new one.');
        }

        if ((int) $otp->attempts >= self::OTP_MAX_ATTEMPTS) {
            throw new DomainException('Too many incorrect attempts. Please request a new OTP.');
        }

        if (!Hash::check($code, (string) $otp->code_hash)) {
            $this->otps->update((int) $otp->id, [
                'attempts' => (int) $otp->attempts + 1,
            ]);

            throw new DomainException('The OTP code is incorrect.');
        }

        $this->otps->update((int) $otp->id, [
            'consumed_at' => now(),
        ]);

        return true;
    }

    public function markVerified(int $userId, string $field): bool
    {
        $attribute = match ($field) {
            'phone' => 'phone_verified_at',
            'email' => 'email_verified_at',
            default => throw new InvalidArgumentException(sprintf('Unsupported verification field [%s].', $field)),
        };

        return $this->users->update($userId, [
            $attribute => now(),
        ]) !== null;
    }

    public function register(string $phone, string $fullName, string $pincode, string $preferredLanguage = 'gu', string $roleCode = 'farmer'): User
    {
        if ($this->users->findByPhone($phone) !== null) {
            throw new DomainException('An account with this phone number already exists.');
        }

        $user = $this->users->create([
            'full_name' => $fullName,
            'phone' => $phone,
            'preferred_language' => $preferredLanguage,
            'is_active' => true,
        ]);

        $this->profiles->create([
            'user_id' => (int) $user->id,
            'pincode' => $pincode,
        ]);

        $role = $this->roles->findFirstWhere(['code' => $roleCode]);

        if ($role !== null) {
            $this->userRoles->create([
                'user_id' => (int) $user->id,
                'role_id' => (int) $role->id,
            ]);
        }

        return $user;
    }

    public function loginWithOtp(string $identifier, string $code, string $purpose = 'login'): array
    {
        $user = $this->users->findByIdentifier($identifier);

        if ($user === null) {
            throw new DomainException('No account found for the given phone/email.');
        }

        if (!$user->isActive()) {
            throw new DomainException('This account is inactive. Please contact support.');
        }

        $this->verifyOtp($identifier, $purpose, $code);

        $field = $user->email === $identifier ? 'email' : 'phone';

        $this->users->update((int) $user->id, [
            $field . '_verified_at' => now(),
            'last_login_at' => now(),
        ]);

        return $this->issueTokenPair($user->refresh());
    }

    public function loginWithPassword(string $identifier, string $password): array
    {
        $user = $this->users->findByIdentifier($identifier);

        if ($user === null || $user->password_hash === null || !Hash::check($password, $user->password_hash)) {
            throw new DomainException('Invalid credentials.');
        }

        if (!$user->isActive()) {
            throw new DomainException('This account is inactive. Please contact support.');
        }

        if (!$user->isVerified()) {
            throw new DomainException('This account has not been verified yet.');
        }

        $this->users->update((int) $user->id, [
            'last_login_at' => now(),
        ]);

        return $this->issueTokenPair($user->refresh());
    }

    public function refreshToken(string $refreshToken): array
    {
        $model = Sanctum::personalAccessTokenModel();
        $token = $model::findToken($refreshToken);

        if ($token === null) {
            throw new DomainException('The refresh token is invalid.');
        }

        if ($token->name !== 'refresh') {
            throw new DomainException('The provided token is not a refresh token.');
        }

        if ($token->expires_at !== null && $token->expires_at->isPast()) {
            throw new DomainException('The refresh token has expired. Please log in again.');
        }

        $user = $token->tokenable;

        if (!$user instanceof User || !$user->isActive()) {
            throw new DomainException('The account associated with this token is inactive.');
        }

        $token->delete();

        return $this->issueTokenPair($user);
    }

    public function logout(User $user, ?string $accessToken = null): void
    {
        if ($accessToken === null) {
            $this->revokeAllTokens($user);

            return;
        }

        $model = Sanctum::personalAccessTokenModel();
        $token = $model::findToken($accessToken);

        if ($token !== null && (int) $token->tokenable_id === (int) $user->id) {
            $token->delete();
        }
    }

    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    public function forgotPassword(string $identifier): void
    {
        $user = $this->users->findByIdentifier($identifier);

        if ($user === null || !$user->isActive()) {
            return;
        }

        $this->requestOtp($identifier, 'sms', 'password_reset', (int) $user->id);
    }

    public function resetPassword(string $identifier, string $code, string $newPassword): void
    {
        $user = $this->users->findByIdentifier($identifier);

        if ($user === null) {
            throw new DomainException('No account found for the given phone/email.');
        }

        $this->verifyOtp($identifier, 'password_reset', $code);

        $this->users->update((int) $user->id, [
            'password_hash' => Hash::make($newPassword),
            'phone_verified_at' => $user->phone_verified_at ?? now(),
        ]);
    }

    /**
     * @return array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}
     */
    private function issueTokenPair(User $user): array
    {
        $access = $user->createToken('access', ['access'], now()->addMinutes(self::ACCESS_TTL_MINUTES));
        $refresh = $user->createToken('refresh', ['refresh'], now()->addDays(self::REFRESH_TTL_DAYS));

        return [
            'access_token' => $access->plainTextToken,
            'refresh_token' => $refresh->plainTextToken,
            'token_type' => 'Bearer',
            'expires_in' => self::ACCESS_TTL_MINUTES * 60,
            'user' => $user,
        ];
    }
}
