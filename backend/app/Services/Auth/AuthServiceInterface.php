<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;

interface AuthServiceInterface
{
    /**
     * Generate and persist a one-time password for a destination.
     *
     * @throws \DomainException when a pending OTP already exists
     */
    public function requestOtp(string $destination, string $channel, string $purpose, ?int $userId = null): void;

    /**
     * Validate a submitted OTP code against the latest pending record.
     *
     * Consumes the OTP on success so it cannot be replayed.
     *
     * @throws \DomainException          when the OTP is expired, exhausted, or mismatched
     * @throws \InvalidArgumentException when no pending OTP exists
     */
    public function verifyOtp(string $destination, string $purpose, string $code): bool;

    /**
     * Persist the phone/email verification timestamp on the user.
     */
    public function markVerified(int $userId, string $field): bool;

    /**
     * Create a new user account with a farmer profile and the given role.
     *
     * The email is stored lowercased and the password is stored as a bcrypt hash.
     * A token pair is issued immediately so the new account is signed in.
     *
     * @return array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}
     *
     * @throws \DomainException when the phone number or email address is already registered
     */
    public function register(
        string $email,
        string $password,
        string $phone,
        string $fullName,
        string $pincode,
        string $preferredLanguage = 'gu',
        string $roleCode = 'farmer',
    ): array;

    /**
     * Verify an OTP for the given purpose and return a token pair.
     *
     * Marks the phone/email as verified and updates last_login_at.
     *
     * @return array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}
     *
     * @throws \DomainException          when the account is missing/inactive or the OTP fails
     * @throws \InvalidArgumentException when no pending OTP exists
     */
    public function loginWithOtp(string $identifier, string $code, string $purpose = 'login'): array;

    /**
     * Authenticate with a verified password.
     *
     * @return array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}
     *
     * @throws \DomainException when credentials are invalid, the account is inactive, or the account is unverified
     */
    public function loginWithPassword(string $identifier, string $password): array;

    /**
     * Exchange a valid refresh token for a fresh token pair.
     *
     * @return array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}
     *
     * @throws \DomainException when the refresh token is invalid, expired, or its owner is inactive
     */
    public function refreshToken(string $refreshToken): array;

    /**
     * Revoke the access token that authenticated the request.
     */
    public function logout(User $user, ?string $accessToken = null): void;

    /**
     * Revoke every token issued to the user.
     */
    public function revokeAllTokens(User $user): void;

    /**
     * Issue a password-reset OTP for an existing, active account.
     *
     * Silently no-ops when no account exists (no user enumeration).
     */
    public function forgotPassword(string $identifier): void;

    /**
     * Verify the password-reset OTP and set a new password.
     *
     * @throws \DomainException when the account is missing or the OTP fails
     */
    public function resetPassword(string $identifier, string $code, string $newPassword): void;
}
