<?php

use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\app\RegisterController;
use App\Http\Controllers\app\Http\LoginController;
use App\Http\Controllers\app\ParentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
