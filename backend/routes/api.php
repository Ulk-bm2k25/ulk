<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationPaymentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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