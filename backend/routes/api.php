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