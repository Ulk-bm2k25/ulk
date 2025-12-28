<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class EmailVerificationController extends Controller
{
    /**
     * Renvoyer l'email de vérification
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        // Vérifier si l'email est déjà vérifié
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Votre email est déjà vérifié.'
            ], 400);
        }

        // Envoyer l'email de vérification
        $user->sendEmailVerificationNotification();

        // Logger l'activité
        $this->logActivity($user, 'email_verification_resend', 'Email de vérification renvoyé');

        return response()->json([
            'success' => true,
            'message' => 'Email de vérification envoyé avec succès.'
        ], 200);
    }

    /**
     * Vérifier l'email de l'utilisateur
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verify(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur par ID
        $user = User::findOrFail($request->route('id'));

        // Vérifier le hash
        if (!hash_equals(
            (string) $request->route('hash'),
            sha1($user->getEmailForVerification())
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Lien de vérification invalide.'
            ], 403);
        }

        // Vérifier si l'email est déjà vérifié
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email déjà vérifié.'
            ], 400);
        }

        // Marquer l'email comme vérifié
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Logger l'activité
        $this->logActivity($user, 'email_verified', 'Email vérifié avec succès');

        // Si c'est une requête API, retourner JSON
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Email vérifié avec succès.',
                'redirect_url' => config('app.frontend_url') . '/email-verified'
            ], 200);
        }

        // Sinon rediriger vers le frontend
        return redirect(config('app.frontend_url') . '/email-verified');
    }

    /**
     * Obtenir le statut de vérification de l'email
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'email_verified' => $user->hasVerifiedEmail(),
            'email_verified_at' => $user->email_verified_at,
        ], 200);
    }

    /**
     * Logger une activité
     */
    private function logActivity($user, $action, $details)
    {
        DB::table('logs_activite')->insert([
            'user_id' => $user->id,
            'action' => $action,
            'details' => $details,
            'timestamp' => now(),
        ]);
    }
}