<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        foreach ($permissions as $permission) {
            if ($user !== null && $user->hasPermission($permission)) {
                return $next($request);
            }
        }

        throw new AuthorizationException('You do not have the required permission to access this resource.');
    }
}
