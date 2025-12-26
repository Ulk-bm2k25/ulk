<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ParentPortalController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
    
    // Routes Espace Parent
    Route::prefix('parent')->group(function () {
        Route::get('/dashboard', [ParentPortalController::class, 'getDashboardSummary']);
        Route::get('/children', [ParentPortalController::class, 'getChildren']);
        Route::get('/children/{id}', [ParentPortalController::class, 'getChildDetails']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get(
        '/pdf/fiche-inscription/{inscription}',
        [PdfController::class, 'ficheInscription']
    );

    Route::get(
        '/pdf/carte-scolarite/{eleve}',
        [PdfController::class, 'carteScolarite']
    );
});



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('classes', ClassController::class);
    Route::post('classes/{classId}/assign-eleve', [ClassController::class, 'assignEleve']);
    Route::delete('classes/{classId}/unassign-eleve/{eleveId}', [ClassController::class, 'unassignEleve']);
    Route::post('classes/{classId}/assign-enseignant', [ClassController::class, 'assignEnseignant']);
    Route::get('niveaux', [ClassController::class, 'niveaux']);
    Route::get('matieres', [ClassController::class, 'matieres']);
});


