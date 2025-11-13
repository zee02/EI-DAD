<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // NOVO: Obter a URL base do servidor (ex: http://localhost:8000)
        $serverBaseUrl = config('app.url') . ':8000';

        // Formata a photo_url
        $photoUrl = $this->photo_url
            ? $serverBaseUrl . '/storage/photos/' . $this->photo_url
            : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'photo_url' => $photoUrl, // <-- NOVO
            'role' => $this->role,      // <-- NOVO
        ];
    }
}
