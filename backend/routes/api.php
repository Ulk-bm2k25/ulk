<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ParentPortalController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminStudentController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ScolariteController;
use App\Http\Controllers\AcademicStructureController;
use App\Http\Controllers\AffectationController;
use App\Http\Controllers\Api\NotificationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Inscription complète (publique)
Route::post('/inscription/complete', [InscriptionController::class, 'completeInscription']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
    
    Route::prefix('admin')->group(function () {
        // ========== INSCRIPTIONS ==========
        Route::get('/inscriptions', [InscriptionController::class, 'index']);
        Route::get('/inscriptions/{id}', [InscriptionController::class, 'show']);
        Route::patch('/inscriptions/{id}/status', [InscriptionController::class, 'updateStatus']);
        
        // Documents élèves
        Route::get('/eleves/{eleveId}/documents', [InscriptionController::class, 'getEleveDocuments']);
        Route::post('/eleves/{eleveId}/documents', [InscriptionController::class, 'addDocument']);
        
        // ========== STRUCTURE ACADÉMIQUE ==========
        // Niveaux scolaires
        Route::get('/academic/niveaux', [AcademicStructureController::class, 'indexNiveaux']);
        Route::post('/academic/niveaux', [AcademicStructureController::class, 'storeNiveau']);
        Route::put('/academic/niveaux/{id}', [AcademicStructureController::class, 'updateNiveau']);
        Route::delete('/academic/niveaux/{id}', [AcademicStructureController::class, 'destroyNiveau']);
        
        // Cycles
        Route::get('/academic/cycles', [AcademicStructureController::class, 'indexCycles']);
        Route::post('/academic/cycles', [AcademicStructureController::class, 'storeCycle']);
        Route::put('/academic/cycles/{id}', [AcademicStructureController::class, 'updateCycle']);
        Route::delete('/academic/cycles/{id}', [AcademicStructureController::class, 'destroyCycle']);
        
        // Séries
        Route::get('/academic/series', [AcademicStructureController::class, 'indexSeries']);
        Route::post('/academic/series', [AcademicStructureController::class, 'storeSerie']);
        Route::put('/academic/series/{id}', [AcademicStructureController::class, 'updateSerie']);
        Route::delete('/academic/series/{id}', [AcademicStructureController::class, 'destroySerie']);
        
        // Années scolaires
        Route::get('/academic/annees-scolaires', [AcademicStructureController::class, 'indexAnneeScolaires']);
        Route::get('/academic/annee-scolaire/active', [AcademicStructureController::class, 'getActiveAnneeScolaire']);
        Route::post('/academic/annees-scolaires', [AcademicStructureController::class, 'storeAnneeScolaire']);
        Route::put('/academic/annees-scolaires/{id}', [AcademicStructureController::class, 'updateAnneeScolaire']);
        Route::delete('/academic/annees-scolaires/{id}', [AcademicStructureController::class, 'destroyAnneeScolaire']);
        
        // ========== AFFECTATIONS ==========
        Route::get('/affectations', [AffectationController::class, 'index']);
        Route::post('/affectations', [AffectationController::class, 'store']);
        Route::post('/affectations/{id}/transfer', [AffectationController::class, 'transfer']);
        Route::delete('/affectations/{id}/unassign', [AffectationController::class, 'unassign']);
        Route::get('/affectations/eleve/{eleveId}', [AffectationController::class, 'getByEleve']);
        Route::get('/affectations/classe/{classeId}', [AffectationController::class, 'getByClasse']);
        
        // Grades & Bulletins
        Route::get('/grades/class/{classId}', [NoteController::class, 'getGradesByClass']);
        Route::post('/grades/bulk', [NoteController::class, 'storeBulk']);
        Route::post('/bulletins/generate/{classId}', [NoteController::class, 'generateBulletins']);
        Route::get('/bulletins/download/{eleveId}', [NoteController::class, 'downloadBulletin']);
        Route::get('/matieres', [NoteController::class, 'getMatieres']);
        Route::get('/semestres', [NoteController::class, 'getSemestres']);

        // Attendance
        Route::get('/attendance/class/{classId}', [AttendanceController::class, 'getClassAttendance']);
        Route::post('/attendance/bulk', [AttendanceController::class, 'storeBulk']);

        // Finance Routes
        Route::get('/finance/stats', [PaiementController::class, 'getAdminFinanceStats']);
        Route::get('/finance/payments', [PaiementController::class, 'getAdminPayments']);

        // Admin specific
        Route::get('/dashboard/stats', [AdminController::class, 'getDashboardStats']);
        Route::get('/students', [AdminStudentController::class, 'getStudents']);
        Route::get('/students/{id}', [AdminStudentController::class, 'getStudentDetails']);
        Route::put('/students/{id}', [AdminStudentController::class, 'updateStudent']);
        Route::post('/students/{id}/transfer', [AdminStudentController::class, 'transferStudent']);
        Route::get('/teachers', [AdminController::class, 'getTeachers']);
        Route::get('/notifications/history', [AdminController::class, 'getNotificationsHistory']);
        Route::post('/notifications/send', [AdminController::class, 'sendNotification']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'store']);

        // Scolarité
        Route::get('/scolarite/documents', [ScolariteController::class, 'getDocumentsHistory']);
        Route::get('/eleves/{id}/carte', [ScolariteController::class, 'generateIDCard']);
        
        // ========== PDFs ==========
        Route::get('/pdf/fiche-inscription/{inscriptionId}', [PdfController::class, 'ficheInscription']);
        Route::get('/pdf/carte-scolarite/{eleveId}', [PdfController::class, 'carteScolarite']);
        Route::get('/pdf/fiche-inscription/{inscriptionId}/preview', [PdfController::class, 'previewFicheInscription']);
        Route::get('/pdf/carte-scolarite/{eleveId}/preview', [PdfController::class, 'previewCarteScolarite']);
        
        // ========== NOTIFICATIONS ==========
        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::get('/templates', [NotificationController::class, 'templates']);
            Route::post('/payment-reminder', [NotificationController::class, 'sendPaymentReminder']);
            Route::post('/urgent', [NotificationController::class, 'sendUrgentNotification']);
            Route::post('/general', [NotificationController::class, 'sendGeneralNotification']);
            Route::post('/class', [NotificationController::class, 'sendToClass']);
            Route::get('/{id}', [NotificationController::class, 'show']);
            Route::post('/{id}/retry', [NotificationController::class, 'retry']);
        });
    });



    // Parent Routes
    Route::prefix('parent')->group(function () {
        Route::get('/dashboard', [ParentPortalController::class, 'getDashboardSummary']);
        Route::get('/children', [ParentPortalController::class, 'getChildren']);
        Route::get('/children/{id}', [ParentPortalController::class, 'getChildDetails']);
        Route::get('/children/{id}/grades', [NoteController::class, 'getStudentGrades']);
        Route::get('/children/{id}/bulletin', [NoteController::class, 'downloadBulletin']);
        Route::get('/children/{id}/carte', [ScolariteController::class, 'generateIDCard']);
        Route::get('/children/{id}/documents', [InscriptionController::class, 'getEleveDocuments']);
        Route::post('/children/{id}/documents', [InscriptionController::class, 'addDocument']);
        Route::get('/notifications', [NotificationController::class, 'myNotifications']);
        Route::patch('/notifications/{id}/read', [ParentPortalController::class, 'markNotificationAsRead']);
        Route::post('/notifications/read-all', [ParentPortalController::class, 'markAllAsRead']);
        Route::post('/enroll-child', [ParentPortalController::class, 'enrollChild']);

        Route::get('/semestres', [NoteController::class, 'getSemestres']);
        Route::get('/children/{id}/attendance', [AttendanceController::class, 'getStudentAttendance']);
        Route::post('/children/{id}/update-photo', [ParentPortalController::class, 'updateChildPhoto']);
        Route::get('/profile', [ParentPortalController::class, 'getProfile']);
        Route::post('/profile/update', [ParentPortalController::class, 'updateProfile']);
        Route::post('/profile/password', [ParentPortalController::class, 'updatePassword']);
        
        // Payments
        Route::get('/children/{id}/payments', [PaiementController::class, 'getStudentPayments']);
        Route::post('/payments/process', [PaiementController::class, 'processPayment']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('classes', ClassController::class);
    Route::post('classes/{classId}/assign-eleve', [ClassController::class, 'assignEleve']);
    Route::delete('classes/{classId}/unassign-eleve/{eleveId}', [ClassController::class, 'unassignEleve']);
    Route::post('classes/{classId}/assign-enseignant', [ClassController::class, 'assignEnseignant']);
    Route::get('niveaux', [ClassController::class, 'niveaux']);
    Route::get('matieres', [ClassController::class, 'matieres']);
});


