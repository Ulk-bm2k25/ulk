<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;

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