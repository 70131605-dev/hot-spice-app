<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards /api/admin/* routes. auth:sanctum only proves the bearer token is
 * valid; this confirms the token belongs to an Admin (not a customer User),
 * so a customer's token can never reach admin endpoints and vice versa.
 */
class EnsureAdminToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() instanceof Admin) {
            abort(403, 'Admin access required.');
        }

        return $next($request);
    }
}
