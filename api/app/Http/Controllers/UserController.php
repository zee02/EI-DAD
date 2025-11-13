<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage; // <-- Novo import

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }


    public function patchPhotoURL(Request $request, User $user)
    {
        // Valida a URL (pode ser nullable string)
        $data = $request->validate(['photo_url' => 'nullable|string']);

        // Lógica para apagar a foto antiga, se existir
        if ($user->photo_url) {
            // Usa basename() para extrair o nome do ficheiro (ex: 2jDawmlcKQz0TOYH28WHZGb5dTSHZ9m8GXjv7R8y.png)
            $old_photo_filename = basename($user->photo_url);

            // Se o ficheiro da foto antiga existir na pasta 'photos'
            if (Storage::disk('public')->exists('photos/' . $old_photo_filename)) {
                // Apaga o ficheiro
                Storage::disk('public')->delete('photos/' . $old_photo_filename);
            }
        }

        // Remove o prefixo '/storage/photos/' e guarda apenas o nome do ficheiro
        // A photo_url é armazenada como o nome do ficheiro.
        if (!empty($data['photo_url'])) {
            $user->photo_url = basename($data['photo_url']);
        } else {
            $user->photo_url = null; // Se for nullable, define como null
        }

        $user->save();

        return new UserResource($user);
    }
}
