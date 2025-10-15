<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/leaflet', [MapController::class, 'leaflet'])->name('leaflet');
Route::get('/openlayer', [MapController::class, 'openlayer'])->name('openlayer');
