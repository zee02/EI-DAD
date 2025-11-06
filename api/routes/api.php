<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
	Route::get('/users/me', function (Request $request) {
		return $request->user();
	});
	Route::post('logout', [AuthController::class, 'logout']);
});

Route::get('/metadata', function (Request $request) {
	return [
		'name' => 'DAD 2025/26 Worksheet API',
		'version' => '0.0.1',
	];
});

Route::apiResources([
	'games' => GameController::class,
	'users' => UserController::class,
]);
