<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ClassController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



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


