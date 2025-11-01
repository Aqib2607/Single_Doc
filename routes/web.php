<?php

use Illuminate\Support\Facades\Route;

Route::get('/guest-appointment', function () {
    return view('guest-appointment');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');