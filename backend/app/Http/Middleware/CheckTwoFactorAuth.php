<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTwoFactorAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Si l'utilisateur n'est pas authentifié
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.'
            ], 401);
        }

        // Si l'utilisateur n'a pas activé 2FA, continuer normalement
        if (!$user->two_factor_confirmed_at) {
            return $next($request);
        }

        // Vérifier si la session 2FA a été vérifiée
        // On utilise un attribut temporaire sur le token pour tracker la vérification 2FA
        $token = $user->currentAccessToken();
        
        if (!$token || !$token->can('2fa-verified')) {
            return response()->json([
                'success' => false,
                'message' => 'Authentification à deux facteurs requise.',
                'requires_2fa' => true
            ], 403);
        }

        return $next($request);
    }
}