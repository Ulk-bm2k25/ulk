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
        Route::get('/teachers', [ClassController::class, 'teachers']);
        
        // Grades & Bulletins
        Route::get('/grades/class/{classId}', [NoteController::class, 'getGradesByClass']);
        Route::post('/grades/bulk', [NoteController::class, 'storeBulk']);
        Route::post('/bulletins/generate/{classId}', [NoteController::class, 'generateBulletins']);
        Route::get('/matieres', [NoteController::class, 'getMatieres']);
        Route::get('/semestres', [NoteController::class, 'getSemestres']);

        // Attendance
        Route::get('/attendance/class/{classId}', [AttendanceController::class, 'getClassAttendance']);
        Route::post('/attendance/bulk', [AttendanceController::class, 'storeBulk']);

        // Payments
        // Admin specific
        Route::get('/dashboard/stats', [AdminController::class, 'getDashboardStats']);
        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::get('/teachers', [AdminController::class, 'getTeachers']);
        Route::post('/notifications/send', [AdminController::class, 'sendNotification']);
    });

    // Parent Routes
    Route::prefix('parent')->group(function () {
        Route::get('/dashboard', [ParentPortalController::class, 'getDashboardSummary']);
        Route::get('/children', [ParentPortalController::class, 'getChildren']);
        Route::get('/children/{id}', [ParentPortalController::class, 'getChildDetails']);
        Route::get('/children/{id}/grades', [NoteController::class, 'getStudentGrades']);
        Route::get('/notifications', [ParentPortalController::class, 'getNotifications']);
        Route::post('/enroll-child', [ParentPortalController::class, 'enrollChild']);
        Route::get('/semestres', [NoteController::class, 'getSemestres']);
        Route::get('/children/{id}/attendance', [AttendanceController::class, 'getStudentAttendance']);
        Route::get('/children/{id}/payments', [PaiementController::class, 'getStudentPayments']);
        Route::post('/payments/process', [PaiementController::class, 'processPayment']);
        Route::get('/profile', [ParentPortalController::class, 'getProfile']);
        Route::post('/profile/update', [ParentPortalController::class, 'updateProfile']);
        Route::post('/profile/password', [ParentPortalController::class, 'updatePassword']);
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


