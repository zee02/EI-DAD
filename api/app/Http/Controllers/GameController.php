<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use App\Http\Requests\StoreGameRequest;


class GameController extends Controller
{
    public function index()
    {
        return Game::all();
    }
    public function store(StoreGameRequest $request)
    {
        $game = Game::create($request->validated());
        return response()->json($game, 201);
    }
    public function show(Game $game)
    {
        return $game;
    }
    public function update(StoreGameRequest $request, Game $game)
    {
        $game->update($request->validated());
        return response()->json($game);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $game)
    {
        //
    }
}
