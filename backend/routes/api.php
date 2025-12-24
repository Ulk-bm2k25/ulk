<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

<<<<<<< HEAD

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
=======
use App\Http\Controllers\Api\ClassController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('classes', ClassController::class);
    Route::post('classes/{classId}/assign-eleve', [ClassController::class, 'assignEleve']);
    Route::delete('classes/{classId}/unassign-eleve/{eleveId}', [ClassController::class, 'unassignEleve']);
    Route::post('classes/{classId}/assign-enseignant', [ClassController::class, 'assignEnseignant']);
    Route::get('niveaux', [ClassController::class, 'niveaux']);
    Route::get('matieres', [ClassController::class, 'matieres']);
});

>>>>>>> fc42d1826e0598bb0abb46f3def02d5e7ef9f4cf
