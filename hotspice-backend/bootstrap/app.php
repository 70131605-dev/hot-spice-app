<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'admin.auth' => \App\Http\Middleware\AdminAuthenticate::class,
            'admin.token' => \App\Http\Middleware\EnsureAdminToken::class,
        ]);

        // Laravel auto-registers a default "redirect guests to route('login')"
        // callback, but this app has no named "login" route (admin auth uses
        // its own middleware, customers use Sanctum tokens). Left alone, that
        // default crashes with a 500 (RouteNotFoundException) instead of a
        // clean 401 whenever an api/* request doesn't send an Accept header.
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('api/*') ? null : '/admin/login');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function ($request, $exception) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });
    })->create();