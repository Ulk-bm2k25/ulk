<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\TwoFactorAuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\PermissionsController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\ProgrammeController;
use App\Http\Controllers\Api\AnneeScolaireController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes - Système de Gestion Scolaire
|--------------------------------------------------------------------------
|
| Routes API pour le module d'authentification et sécurité
| Base URL: /api
|
*/

// ============================================
// ROUTES PUBLIQUES (Sans authentification)
// ============================================

Route::prefix('auth')->group(function () {
    
    // Inscription
    Route::post('/register/parent', [AuthController::class, 'registerParent'])
        ->name('auth.register.parent');
    
    // Connexion
    Route::post('/login', [AuthController::class, 'login'])
        ->name('auth.login');
    
    // Mot de passe oublié
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
        ->name('auth.forgot-password');
    
    // Réinitialisation du mot de passe
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
        ->name('auth.reset-password');
    
    // Vérification du token de reset
    Route::post('/verify-reset-token', [PasswordResetController::class, 'verifyToken'])
        ->name('auth.verify-reset-token');
});

// ============================================
// ROUTES PROTÉGÉES (Authentification requise)
// ============================================

Route::middleware('auth:sanctum')->group(function () {
    
    // ----------------------------------------
    // Authentification & Session
    // ----------------------------------------
    Route::prefix('auth')->group(function () {
        
        // Déconnexion
        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');
        
        // Déconnexion de tous les appareils
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])
            ->name('auth.logout-all');
        
        // Informations utilisateur connecté
        Route::get('/me', [AuthController::class, 'me'])
            ->name('auth.me');
        
        // Rafraîchir le token
        Route::post('/refresh-token', [AuthController::class, 'refreshToken'])
            ->name('auth.refresh-token');
    });
    
    // ----------------------------------------
    // Vérification d'email
    // ----------------------------------------
    Route::prefix('email')->group(function () {
        
        // Renvoyer l'email de vérification
        Route::post('/verification-notification', [EmailVerificationController::class, 'resend'])
            ->name('verification.send');
        
        // Vérifier l'email
        Route::get('/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->name('verification.verify');
        
        // Statut de vérification
        Route::get('/verification-status', [EmailVerificationController::class, 'status'])
            ->name('verification.status');
    });
    
    // ----------------------------------------
    // Authentification à deux facteurs (2FA)
    // ----------------------------------------
    Route::prefix('2fa')->group(function () {
        
        // Activer 2FA
        Route::post('/enable', [TwoFactorAuthController::class, 'enable'])
            ->name('2fa.enable');
        
        // Confirmer l'activation 2FA
        Route::post('/confirm', [TwoFactorAuthController::class, 'confirm'])
            ->name('2fa.confirm');
        
        // Désactiver 2FA
        Route::post('/disable', [TwoFactorAuthController::class, 'disable'])
            ->name('2fa.disable');
        
        // Vérifier le code 2FA (avec token temporaire)
        Route::post('/verify', [TwoFactorAuthController::class, 'verify'])
            ->name('2fa.verify');
        
        // Compléter le login après 2FA
        Route::post('/complete-login', [AuthController::class, 'completeTwoFactorLogin'])
            ->name('2fa.complete-login');
        
        // Obtenir les codes de récupération
        Route::get('/recovery-codes', [TwoFactorAuthController::class, 'recoveryCodes'])
            ->name('2fa.recovery-codes');
        
        // Régénérer les codes de récupération
        Route::post('/recovery-codes/regenerate', [TwoFactorAuthController::class, 'regenerateRecoveryCodes'])
            ->name('2fa.recovery-codes.regenerate');
    });
    
    // ----------------------------------------
    // Gestion du profil utilisateur
    // ----------------------------------------
    Route::prefix('profile')->group(function () {
        
        // Obtenir le profil
        Route::get('/', [ProfileController::class, 'show'])
            ->name('profile.show');
        
        // Mettre à jour le profil
        Route::put('/', [ProfileController::class, 'update'])
            ->name('profile.update');
        
        // Changer le mot de passe
        Route::post('/change-password', [ProfileController::class, 'changePassword'])
            ->name('profile.change-password');
        
        // Supprimer le compte
        Route::delete('/', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');
    });
    
    // ----------------------------------------
    // Gestion des administrateurs (Admin only)
    // ----------------------------------------
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        
        // Créer un administrateur
        Route::post('/register', [AuthController::class, 'registerAdmin'])
            ->name('admin.register');
        
        // Liste des administrateurs
        Route::get('/list', [ProfileController::class, 'listAdmins'])
            ->name('admin.list');
        
        // Détails d'un administrateur
        Route::get('/{id}', [ProfileController::class, 'showAdmin'])
            ->name('admin.show');
        
        // Mettre à jour un administrateur
        Route::put('/{id}', [ProfileController::class, 'updateAdmin'])
            ->name('admin.update');
        
        // Supprimer un administrateur
        Route::delete('/{id}', [ProfileController::class, 'destroyAdmin'])
            ->name('admin.destroy');
    });
    
    // ----------------------------------------
    // Logs d'activité (Admin only)
    // ----------------------------------------
    Route::prefix('logs')->middleware('role:admin')->group(function () {
        
        // Liste des logs
        Route::get('/', [\App\Http\Controllers\Api\LogController::class, 'index'])
            ->name('logs.index');
        
        // Logs d'un utilisateur spécifique
        Route::get('/user/{userId}', [\App\Http\Controllers\Api\LogController::class, 'userLogs'])
            ->name('logs.user');
        
        // Recherche dans les logs
        Route::post('/search', [\App\Http\Controllers\Api\LogController::class, 'search'])
            ->name('logs.search');
    });
    
    // ----------------------------------------
    // Gestion des sessions actives
    // ----------------------------------------
    Route::prefix('sessions')->group(function () {
        
        // Liste des sessions actives
        Route::get('/', [ProfileController::class, 'activeSessions'])
            ->name('sessions.active');
        
        // Révoquer une session spécifique
        Route::delete('/{tokenId}', [ProfileController::class, 'revokeSession'])
            ->name('sessions.revoke');
    });
});

// ============================================
// ROUTE DE TEST (À supprimer en production)
// ============================================

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API de Gestion Scolaire - Module Authentification',
        'version' => '1.0.0',
        'timestamp' => now(),
    ]);
})->name('api.test');

// ============================================
// ROUTE 404 POUR LES ROUTES API NON TROUVÉES
// ============================================

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route API non trouvée',
    ], 404);
});


// Routes protégées par auth:sanctum
Route::middleware('auth:sanctum')->group(function() {

    Route::apiResource('classes', ClasseController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('eleves', EleveController::class);
    Route::apiResource('seances', SeanceController::class)->only(['index','store','show']);
    Route::apiResource('programmes', ProgrammeController::class)->only(['index','store']);
    Route::apiResource('annee-scolaires', AnneeScolaireController::class);

});

// ============================================
// ROUTES PERMISSIONS
// ============================================
Route::get('permissions', [PermissionsController::class, 'index']);
Route::post('permissions', [PermissionsController::class, 'store']);
Route::get('permissions/{id}', [PermissionsController::class, 'show']);
Route::put('permissions/{id}', [PermissionsController::class, 'update']);
Route::get('students', [PermissionsController::class, 'students']);
Route::get('courses', [PermissionsController::class, 'courses']);
Route::post('permissions/{id}/notify', [PermissionsController::class, 'notify']);

// ----------------------------------------
// Dashboard
// ----------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'getDashboardStats']);
    Route::get('/dashboard/activities', [DashboardController::class, 'getRecentActivities']);
    Route::get('/dashboard/attention', [DashboardController::class, 'getStudentsNeedingAttention']);
    Route::get('/notifications', [DashboardController::class, 'getRecentActivities']);
    Route::put('/notifications/{id}/read', [DashboardController::class, 'markAsRead']);
});

// ----------------------------------------
// Gestion des présences
// ----------------------------------------
Route::prefix('presence')->group(function () {
    Route::get('/list', [App\Http\Controllers\Api\PresenceController::class, 'getAttendanceList'])
        ->name('presence.list');
    Route::post('/mark', [App\Http\Controllers\Api\PresenceController::class, 'markAttendance'])
        ->name('presence.mark');
    Route::post('/mark-all', [App\Http\Controllers\Api\PresenceController::class, 'markAllAttendance'])
        ->name('presence.mark-all');
    Route::post('/report', [App\Http\Controllers\Api\PresenceController::class, 'generateAttendanceReport'])
        ->name('presence.report');
    Route::get('/download/{filename}', [App\Http\Controllers\Api\PresenceController::class, 'downloadReport'])
        ->name('presence.download');
    Route::get('/stats', [App\Http\Controllers\Api\PresenceController::class, 'getAttendanceStats'])
        ->name('presence.stats');
    // Ajout de la route manquante pour les cours du jour
    Route::get('/courses-of-day', [App\Http\Controllers\Api\PresenceController::class, 'getCoursesOfDay'])
        ->name('presence.courses-of-day');
    Route::post('/notify', [App\Http\Controllers\Api\PresenceController::class, 'notify'])
        ->name('presence.notify');
});
