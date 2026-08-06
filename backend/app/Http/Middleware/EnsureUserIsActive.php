<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || !$user->isActive()) {
            throw new AuthorizationException('Your account is inactive. Please contact support.');
        }

        return $next($request);
    }
}
