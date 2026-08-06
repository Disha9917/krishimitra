<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\JsonResponse;

final class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'OK', int $status = 200, ?string $errorCode = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
            'errorCode' => $errorCode,
        ], $status);
    }

    public static function error(string $message, int $status = 400, ?string $errorCode = null, mixed $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
            'errorCode' => $errorCode,
        ], $status);
    }
}
