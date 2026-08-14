<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\AuthServiceInterface;
use App\Support\ApiResponse;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthServiceInterface $auth,
    ) {
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'regex:/^[6-9]\d{9}$/'],
            'pinCode' => ['sometimes', 'nullable', 'string', 'max:10'],
            'password' => ['required', 'string', 'min:8', 'max:72'],
            'preferredLanguage' => ['sometimes', 'in:gu,hi,en'],
            'role' => ['sometimes', 'string', 'max:50'],
        ]);

        $pinCode = !empty($data['pinCode']) ? (string) $data['pinCode'] : '380001';

        $result = $this->auth->register(
            strtolower(trim($data['email'])),
            $data['password'],
            $data['phone'],
            $data['fullName'],
            $pinCode,
            $data['preferredLanguage'] ?? 'gu',
            $data['role'] ?? 'farmer',
        );

        try {
            $this->auth->requestOtp($data['phone'], 'sms', 'register', (int) $result['user']->id);
        } catch (DomainException $e) {
            // A pending OTP already exists; verification can still proceed.
        }

        return ApiResponse::success($this->tokenPair($result), 'Account created. You are now signed in.', 201);
    }

    public function requestOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
            'channel' => ['sometimes', 'in:sms,whatsapp,email'],
            'purpose' => ['required', 'in:login,register,password_reset'],
        ]);

        $this->auth->requestOtp(
            $data['identifier'],
            $data['channel'] ?? 'sms',
            $data['purpose'],
        );

        return ApiResponse::success(null, 'OTP sent successfully.');
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
            'password' => ['required_without:otp', 'string'],
            'otp' => ['required_without:password', 'string', 'size:6'],
        ]);

        $result = isset($data['otp'])
            ? $this->auth->loginWithOtp($data['identifier'], $data['otp'])
            : $this->auth->loginWithPassword($data['identifier'], $data['password']);

        return ApiResponse::success($this->tokenPair($result), 'Login successful.');
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
            'otp' => ['required', 'string', 'size:6'],
            'purpose' => ['sometimes', 'in:login,register'],
        ]);

        $result = $this->auth->loginWithOtp($data['identifier'], $data['otp'], $data['purpose'] ?? 'login');

        return ApiResponse::success($this->tokenPair($result), 'OTP verified successfully.');
    }

    public function refresh(Request $request): JsonResponse
    {
        $data = $request->validate([
            'refresh_token' => ['required', 'string'],
        ]);

        $result = $this->auth->refreshToken($data['refresh_token']);

        return ApiResponse::success($this->tokenPair($result), 'Token refreshed successfully.');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->auth->logout($request->user(), $request->bearerToken());

        return ApiResponse::success(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success($this->profile($request->user()));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
        ]);

        try {
            $this->auth->forgotPassword($data['identifier']);
        } catch (DomainException $e) {
            // Do not leak account state; respond with the generic message.
        }

        return ApiResponse::success(null, 'If an account exists for this phone/email, an OTP has been sent.');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
            'otp' => ['required', 'string', 'size:6'],
            'newPassword' => ['required', 'string', 'min:8', 'max:72'],
        ]);

        $this->auth->resetPassword($data['identifier'], $data['otp'], $data['newPassword']);

        return ApiResponse::success(null, 'Password reset successful. You can now log in.');
    }

    /**
     * @param  array{access_token: string, refresh_token: string, token_type: string, expires_in: int, user: User}  $pair
     * @return array<string, mixed>
     */
    private function tokenPair(array $pair): array
    {
        $pair['user'] = $this->profile($pair['user']);

        return $pair;
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(User $user): array
    {
        return [
            'id' => (int) $user->id,
            'uuid' => $user->uuid,
            'fullName' => $user->full_name,
            'phone' => $user->phone,
            'email' => $user->email,
            'phoneVerifiedAt' => $user->phone_verified_at?->toIso8601String(),
            'emailVerifiedAt' => $user->email_verified_at?->toIso8601String(),
            'preferredLanguage' => $user->preferred_language,
            'isActive' => $user->isActive(),
            'lastLoginAt' => $user->last_login_at?->toIso8601String(),
            'roles' => $user->roles()->pluck('roles.code')->all(),
            'permissions' => $user->roles()
                ->join('role_permission', 'role_permission.role_id', '=', 'roles.id')
                ->join('permissions', 'permissions.id', '=', 'role_permission.permission_id')
                ->pluck('permissions.code')
                ->unique()
                ->values()
                ->all(),
        ];
    }
}
