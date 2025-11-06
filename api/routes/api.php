<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/metadata', function () {
    //abort(500, 'Something went wrong');
    return [
        "name" => "DAD 2025/26 Worksheet API",
        "version" => "0.0.1"
    ];
});

Route::apiResources([
 'games' => GameController::class
]);