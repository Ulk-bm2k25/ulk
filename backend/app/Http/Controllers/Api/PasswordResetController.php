<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    /**
     * Envoyer le lien de réinitialisation de mot de passe
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sendResetLink(Request $request): JsonResponse
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Aucun compte n\'est associé à cet email.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Envoyer le lien de réinitialisation
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // Logger l'activité
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $this->logActivity($user, 'password_reset_request', 'Demande de réinitialisation de mot de passe');
        }

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Un email de réinitialisation a été envoyé à votre adresse.',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Impossible d\'envoyer le lien de réinitialisation. Veuillez réessayer.',
        ], 500);
    }

    /**
     * Vérifier la validité du token de réinitialisation
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyToken(Request $request): JsonResponse
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier si le token existe et est valide
        $tokenExists = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('created_at', '>', now()->subHour()) // Token valide pendant 1 heure
            ->first();

        if (!$tokenExists) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide ou expiré',
                'valid' => false
            ], 400);
        }

        // Vérifier que le token correspond
        if (!Hash::check($request->token, $tokenExists->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide',
                'valid' => false
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token valide',
            'valid' => true
        ], 200);
    }

    /**
     * Réinitialiser le mot de passe
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function resetPassword(Request $request): JsonResponse
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/',
                'confirmed'
            ],
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            'email.exists' => 'Aucun compte n\'est associé à cet email.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Réinitialiser le mot de passe
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password_hash' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));

                // Révoquer tous les tokens existants pour forcer une nouvelle connexion
                $user->tokens()->delete();

                // Logger l'activité
                $this->logActivity($user, 'password_reset', 'Mot de passe réinitialisé avec succès');
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Mot de passe réinitialisé avec succès. Veuillez vous reconnecter.',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Échec de la réinitialisation. Le token est peut-être invalide ou expiré.',
        ], 400);
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
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}