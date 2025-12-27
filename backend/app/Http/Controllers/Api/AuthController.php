<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ParentTuteur;
use App\Models\Responsable;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouveau parent/tuteur
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function registerParent(Request $request): JsonResponse
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            // Données utilisateur
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/',
                'confirmed'
            ],
            
            // Données parent/tuteur
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'profession' => 'nullable|string|max:255',
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            'email.unique' => 'Cet email est déjà utilisé.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Créer le profil parent/tuteur
            $parent = ParentTuteur::create([
                'user_id' => $user->id,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'email' => $request->email,
                'adresse' => $request->adresse,
                'profession' => $request->profession,
            ]);

            // Envoyer l'email de vérification
            event(new Registered($user));

            DB::commit();

            // Générer le token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie. Veuillez vérifier votre email.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => 'parent',
                        'email_verified' => false,
                    ],
                    'profile' => $parent,
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Inscription d'un nouvel administrateur (par un super admin)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function registerAdmin(Request $request): JsonResponse
    {
        // Vérifier que l'utilisateur connecté est un admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé. Seuls les administrateurs peuvent créer des comptes admin.'
            ], 403);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/',
                'confirmed'
            ],
            'fonction' => 'required|string|in:Administrateur,Directeur,Super Administrateur',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(), // Admin vérifié automatiquement
            ]);

            // Créer le profil responsable
            $responsable = Responsable::create([
                'user_id' => $user->id,
                'fonction' => $request->fonction,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Administrateur créé avec succès',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => 'admin',
                        'email_verified' => true,
                    ],
                    'profile' => $responsable,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'administrateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connexion d'un utilisateur
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Rechercher l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Vérifier les credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Vérifier si l'email est vérifié (sauf pour les admins)
        if (!$user->isAdmin() && !$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vérifier votre email avant de vous connecter',
                'email_verified' => false
            ], 403);
        }

        // Vérifier si 2FA est activé
        if ($user->two_factor_confirmed_at) {
            // Créer un token temporaire sans les permissions complètes
            $tempToken = $user->createToken($deviceName, ['temp'])->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Authentification à deux facteurs requise',
                'requires_2fa' => true,
                'temp_token' => $tempToken,
                'token_type' => 'Bearer',
            ], 200);
        }

        // Générer le token complet
        $token = $user->createToken($deviceName, ['*'])->plainTextToken;

        // Logger l'activité
        $this->logActivity($user, 'login', 'Connexion réussie');

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRole(),
                    'email_verified' => $user->hasVerifiedEmail(),
                ],
                'profile' => $user->getProfile(),
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Déconnexion (révocation du token actuel)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Révoquer le token actuel
        $request->user()->currentAccessToken()->delete();

        // Logger l'activité
        $this->logActivity($request->user(), 'logout', 'Déconnexion');

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ], 200);
    }

    /**
     * Déconnexion de tous les appareils
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        // Révoquer tous les tokens
        $request->user()->tokens()->delete();

        // Logger l'activité
        $this->logActivity($request->user(), 'logout_all', 'Déconnexion de tous les appareils');

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion de tous les appareils réussie'
        ], 200);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRole(),
                    'email_verified' => $user->hasVerifiedEmail(),
                    'created_at' => $user->created_at,
                ],
                'profile' => $user->getProfile(),
            ]
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

    /**
     * Compléter la connexion après vérification 2FA
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function completeTwoFactorLogin(Request $request): JsonResponse
    {
        $user = $request->user();

        // Vérifier que l'utilisateur a un token temporaire
        $currentToken = $user->currentAccessToken();
        if (!$currentToken || !$currentToken->can('temp')) {
            return response()->json([
                'success' => false,
                'message' => 'Session invalide'
            ], 401);
        }

        // Révoquer le token temporaire
        $currentToken->delete();

        // Créer un nouveau token avec toutes les permissions
        $deviceName = $currentToken->name ?? $request->userAgent();
        $token = $user->createToken($deviceName, ['*', '2fa-verified'])->plainTextToken;

        // Logger l'activité
        $this->logActivity($user, 'login', 'Connexion réussie avec 2FA');

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRole(),
                    'email_verified' => $user->hasVerifiedEmail(),
                ],
                'profile' => $user->getProfile(),
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }
}