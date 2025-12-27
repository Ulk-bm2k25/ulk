<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthController extends Controller
{
    /**
     * Instance Google2FA
     */
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Activer l'authentification à deux facteurs
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function enable(Request $request): JsonResponse
    {
        $user = $request->user();

        // Vérifier si 2FA est déjà activé
        if ($user->two_factor_confirmed_at) {
            return response()->json([
                'success' => false,
                'message' => 'L\'authentification à deux facteurs est déjà activée.'
            ], 400);
        }

        // Générer un secret
        $secret = $this->google2fa->generateSecretKey();

        // Sauvegarder le secret (non confirmé)
        $user->two_factor_secret = encrypt($secret);
        $user->save();

        // Générer le QR code
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        // Logger l'activité
        $this->logActivity($user, '2fa_enable_initiated', 'Activation 2FA initiée');

        return response()->json([
            'success' => true,
            'message' => 'Scannez le QR code avec votre application d\'authentification.',
            'data' => [
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
            ]
        ], 200);
    }

    /**
     * Confirmer l'activation de 2FA avec un code de vérification
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function confirm(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Vérifier que le secret existe
        if (!$user->two_factor_secret) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez d\'abord activer l\'authentification à deux facteurs.'
            ], 400);
        }

        // Décrypter le secret
        $secret = decrypt($user->two_factor_secret);

        // Vérifier le code
        $valid = $this->google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return response()->json([
                'success' => false,
                'message' => 'Code de vérification incorrect.'
            ], 400);
        }

        // Confirmer l'activation et générer les codes de récupération
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_codes = encrypt(json_encode($this->generateRecoveryCodes()));
        $user->save();

        // Logger l'activité
        $this->logActivity($user, '2fa_enabled', 'Authentification à deux facteurs activée');

        return response()->json([
            'success' => true,
            'message' => 'Authentification à deux facteurs activée avec succès.',
            'data' => [
                'recovery_codes' => json_decode(decrypt($user->two_factor_recovery_codes))
            ]
        ], 200);
    }

    /**
     * Désactiver l'authentification à deux facteurs
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function disable(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe requis',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Vérifier le mot de passe
        if (!\Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect.'
            ], 401);
        }

        // Désactiver 2FA
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        // Logger l'activité
        $this->logActivity($user, '2fa_disabled', 'Authentification à deux facteurs désactivée');

        return response()->json([
            'success' => true,
            'message' => 'Authentification à deux facteurs désactivée avec succès.'
        ], 200);
    }

    /**
     * Vérifier un code 2FA lors de la connexion
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verify(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Code requis',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user->two_factor_confirmed_at) {
            return response()->json([
                'success' => false,
                'message' => 'L\'authentification à deux facteurs n\'est pas activée.'
            ], 400);
        }

        $secret = decrypt($user->two_factor_secret);

        // Vérifier si c'est un code de récupération
        if (strlen($request->code) > 6) {
            return $this->verifyRecoveryCode($user, $request->code);
        }

        // Vérifier le code TOTP
        $valid = $this->google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            // Logger la tentative échouée
            $this->logActivity($user, '2fa_verify_failed', 'Échec de vérification 2FA');

            return response()->json([
                'success' => false,
                'message' => 'Code de vérification incorrect.'
            ], 400);
        }

        // Logger la vérification réussie
        $this->logActivity($user, '2fa_verify_success', 'Vérification 2FA réussie');

        return response()->json([
            'success' => true,
            'message' => 'Vérification réussie.'
        ], 200);
    }

    /**
     * Obtenir les codes de récupération
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function recoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->two_factor_confirmed_at) {
            return response()->json([
                'success' => false,
                'message' => 'L\'authentification à deux facteurs n\'est pas activée.'
            ], 400);
        }

        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes));

        return response()->json([
            'success' => true,
            'data' => [
                'recovery_codes' => $recoveryCodes
            ]
        ], 200);
    }

    /**
     * Régénérer les codes de récupération
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function regenerateRecoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->two_factor_confirmed_at) {
            return response()->json([
                'success' => false,
                'message' => 'L\'authentification à deux facteurs n\'est pas activée.'
            ], 400);
        }

        // Générer de nouveaux codes
        $recoveryCodes = $this->generateRecoveryCodes();
        $user->two_factor_recovery_codes = encrypt(json_encode($recoveryCodes));
        $user->save();

        // Logger l'activité
        $this->logActivity($user, '2fa_recovery_codes_regenerated', 'Codes de récupération régénérés');

        return response()->json([
            'success' => true,
            'message' => 'Codes de récupération régénérés avec succès.',
            'data' => [
                'recovery_codes' => $recoveryCodes
            ]
        ], 200);
    }

    /**
     * Vérifier un code de récupération
     */
    protected function verifyRecoveryCode($user, $code): JsonResponse
    {
        $recoveryCodes = collect(json_decode(decrypt($user->two_factor_recovery_codes)));

        if (!$recoveryCodes->contains($code)) {
            return response()->json([
                'success' => false,
                'message' => 'Code de récupération invalide.'
            ], 400);
        }

        // Retirer le code utilisé
        $recoveryCodes = $recoveryCodes->reject(fn($c) => $c === $code);
        $user->two_factor_recovery_codes = encrypt(json_encode($recoveryCodes->values()));
        $user->save();

        // Logger l'utilisation du code
        $this->logActivity($user, '2fa_recovery_code_used', 'Code de récupération utilisé');

        return response()->json([
            'success' => true,
            'message' => 'Code de récupération valide. Pensez à régénérer vos codes.',
            'data' => [
                'remaining_codes' => $recoveryCodes->count()
            ]
        ], 200);
    }

    /**
     * Générer des codes de récupération
     */
    protected function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(\Str::random(10));
        }
        return $codes;
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