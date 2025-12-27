<?php

use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationPaymentController;
use Illuminate\Http\Request;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\app\RegisterController;
use App\Http\Controllers\app\Http\LoginController;
use App\Http\Controllers\app\ParentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route de test
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API Laravel fonctionne correctement !',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Routes pour les statistiques
Route::prefix('stats')->group(function () {
    Route::get('/{classeId}', [StatsController::class, 'index']);
    Route::get('/{classeId}/generales', [StatsController::class, 'generales']);
    Route::get('/{classeId}/academiques', [StatsController::class, 'academiques']);
});

Route::get('/reports/financial/data', [App\Http\Controllers\Api\FinancialReportController::class, 'getData']);

// Routes pour les classes et élèves
Route::prefix('classes')->group(function () {
    Route::get('/', [ClassController::class, 'index']);
    Route::get('/{id}', [ClassController::class, 'show']);
    Route::get('/{id}/students', [ClassController::class, 'show']); // Retourne les élèves de la classe
});

Route::prefix('eleves')->group(function () {
    Route::get('/', function (Request $request) {
        $query = \App\Models\Eleve::query();
        if ($request->has('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }
        return response()->json(['success' => true, 'data' => $query->with('classe')->get()]);
    });
});


// Routes pour les notifications de paiement
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications_payment', [NotificationPaymentController::class, 'index']);
    Route::post('/notifications_payment/{id}/read', [NotificationPaymentController::class, 'markAsRead']);
});


Route::delete('/notifications_payment/{id}', 
    [NotificationPaymentController::class, 'destroy']
)->middleware('auth:sanctum');

Route::delete('/notifications_payment', 
    [NotificationPaymentController::class, 'destroyAll']
)->middleware('auth:sanctum');

Route::delete('/notifications_payment/read', 
    [NotificationPaymentController::class, 'destroyRead']
)->middleware('auth:sanctum');

// Routes pour le Projet 3 - Gestion des notes
Route::prefix('matieres')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\MatiereController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Api\MatiereController::class, 'store'])->middleware('auth:sanctum');
    Route::get('/{id}', [App\Http\Controllers\Api\MatiereController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Api\MatiereController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/{id}', [App\Http\Controllers\Api\MatiereController::class, 'destroy'])->middleware('auth:sanctum');
});

Route::prefix('semestres')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\SemestreController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Api\SemestreController::class, 'store'])->middleware('auth:sanctum');
    Route::put('/{id}', [App\Http\Controllers\Api\SemestreController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/{id}', [App\Http\Controllers\Api\SemestreController::class, 'destroy'])->middleware('auth:sanctum');
});

Route::prefix('notes')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\NoteController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Api\NoteController::class, 'store'])->middleware('auth:sanctum');
    Route::post('/bulk', [App\Http\Controllers\Api\NoteController::class, 'bulkStore'])->middleware('auth:sanctum');
    Route::get('/average', [App\Http\Controllers\Api\NoteController::class, 'calculateAverage']);
    Route::put('/{id}', [App\Http\Controllers\Api\NoteController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/{id}', [App\Http\Controllers\Api\NoteController::class, 'destroy'])->middleware('auth:sanctum');
});

// Routes pour le Projet 4 - Gestion de présence
Route::prefix('presence')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\PresenceController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Api\PresenceController::class, 'store'])->middleware('auth:sanctum');
    Route::post('/bulk', [App\Http\Controllers\Api\PresenceController::class, 'bulkStore'])->middleware('auth:sanctum');
    Route::post('/qr-scan', [App\Http\Controllers\Api\PresenceController::class, 'qrScan'])->middleware('auth:sanctum');
    Route::get('/alerts', [App\Http\Controllers\Api\PresenceController::class, 'getAlerts']);
    Route::put('/{id}', [App\Http\Controllers\Api\PresenceController::class, 'update'])->middleware('auth:sanctum');
    Route::delete('/{id}', [App\Http\Controllers\Api\PresenceController::class, 'destroy'])->middleware('auth:sanctum');
});

Route::prefix('cours')->group(function () {
    Route::get('/schedule/{classeId}', [App\Http\Controllers\Api\CoursController::class, 'getSchedule']);
    Route::post('/schedule', [App\Http\Controllers\Api\CoursController::class, 'storeSchedule'])->middleware('auth:sanctum');
    Route::put('/schedule/{id}', [App\Http\Controllers\Api\CoursController::class, 'updateSchedule'])->middleware('auth:sanctum');
    Route::delete('/schedule/{id}', [App\Http\Controllers\Api\CoursController::class, 'destroySchedule'])->middleware('auth:sanctum');
});

Route::prefix('presence/reports')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\AttendanceReportController::class, 'index']);
    Route::post('/generate', [App\Http\Controllers\Api\AttendanceReportController::class, 'generate'])->middleware('auth:sanctum');
});