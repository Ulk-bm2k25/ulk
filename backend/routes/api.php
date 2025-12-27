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
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ScolariteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
    
    Route::prefix('admin')->group(function () {
        Route::get('/inscriptions', [InscriptionController::class, 'index']);
        Route::patch('/inscriptions/{id}/status', [InscriptionController::class, 'updateStatus']);
        
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
        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::get('/students/{id}', [AdminController::class, 'getStudentDetails']);
        Route::put('/students/{id}', [AdminController::class, 'updateStudent']);
        Route::post('/students/{id}/transfer', [AdminController::class, 'transferStudent']);
        Route::get('/teachers', [AdminController::class, 'getTeachers']);
        Route::get('/notifications/history', [AdminController::class, 'getNotificationsHistory']);
        Route::post('/notifications/send', [AdminController::class, 'sendNotification']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'store']);

        // Scolarité
        Route::get('/scolarite/documents', [ScolariteController::class, 'getDocumentsHistory']);
        Route::get('/eleves/{id}/carte', [ScolariteController::class, 'generateIDCard']);
    });



    // Parent Routes
    Route::prefix('parent')->group(function () {
        Route::get('/dashboard', [ParentPortalController::class, 'getDashboardSummary']);
        Route::get('/children', [ParentPortalController::class, 'getChildren']);
        Route::get('/children/{id}', [ParentPortalController::class, 'getChildDetails']);
        Route::get('/children/{id}/grades', [NoteController::class, 'getStudentGrades']);
        Route::get('/children/{id}/bulletin', [NoteController::class, 'downloadBulletin']);
        Route::get('/children/{id}/carte', [ScolariteController::class, 'generateIDCard']);
        Route::get('/notifications', [ParentPortalController::class, 'getNotifications']);
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


