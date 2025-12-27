<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est authentifié
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.'
            ], 401);
        }

        // Les administrateurs n'ont pas besoin de vérifier leur email
        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        // Vérifier si l'email est vérifié
        if (!$request->user()->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Votre adresse email n\'est pas vérifiée. Veuillez vérifier votre email avant d\'accéder à cette ressource.',
                'email_verified' => false
            ], 403);
        }

        return $next($request);
    }
}