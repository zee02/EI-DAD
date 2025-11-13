<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardThemeController;
use App\Http\Controllers\CardFaceController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas de Autenticação
Route::post('/login', [AuthController::class, 'login']);

// Rotas de Jogo (acessíveis sem autenticação para index/show/store)
Route::apiResource('games', GameController::class)->only(['index', 'show', 'store']);


// Rotas Protegidas pelo Middleware 'auth:sanctum'
Route::middleware('auth:sanctum')->group(function () {
    
    // Rota de Utilizador Autenticado
    Route::get('/users/me', function (Request $request) {
        return $request->user();
    });

    // Rota de Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // Rotas de Upload de Ficheiros
    Route::prefix('files')->group(function () {
        Route::post('userphoto', [FileController::class, 'uploadUserPhoto']);
        Route::post('cardfaces', [FileController::class, 'uploadCardFaces']);
    });

    // Rotas de Recursos RESTful Protegidas (CRUD completo)
    Route::apiResource('games', GameController::class)->except(['index', 'show', 'store']);
    
    Route::apiResources([
        'users' => UserController::class,
        'card-faces' => CardFaceController::class,
        'board-themes' => BoardThemeController::class,
    ]);
    
    // Rota Específica para Atualizar photo_url (Passo 33.1)
    Route::patch('/users/{user}/photo-url', [UserController::class, 'patchPhotoURL']);
});


// Rota de Metadados
Route::get('/metadata', function (Request $request) {
    return [
        'name' => 'DAD 2025/26 Worksheet API',
        'version' => '0.0.1',
    ];
});