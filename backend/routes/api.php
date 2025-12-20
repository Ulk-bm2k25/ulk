<?php

use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;

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
