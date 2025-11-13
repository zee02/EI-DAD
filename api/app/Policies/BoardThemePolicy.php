<?php

namespace App\Policies;

use App\Models\BoardTheme;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BoardThemePolicy
{
    // Permite a qualquer um ver a lista (Passo 280)
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Regras complexas de visualização (Passo 282)
    public function view(User $user, BoardTheme $boardTheme): bool
    {
        // 1. Se for global
        if ($boardTheme->is_global) {
            return true;
        }
        // 2. Se for público
        if ($boardTheme->visibility === 'PU') {
            return true;
        }
        // 3. Se o utilizador logado for o dono
        if ($user && $boardTheme->user_id === $user->id) {
            return true;
        }
        // 4. Se o utilizador for Admin
        if ($user && $user->role === 'A') {
            return true;
        }

        return false;
    }

    // Permite a qualquer utilizador criar (Passo 292)
    public function create(User $user): bool
    {
        return true;
    }

    // Regras de atualização (Passo 296)
    public function update(User $user, BoardTheme $boardTheme): bool
    {
        // 1. Se o utilizador for Admin
        if ($user->role === 'A') {
            return true;
        }
        // 2. Se o utilizador for o dono
        return $boardTheme->user_id === $user->id;
    }

    // Regras de eliminação (Passo 302)
    public function delete(User $user, BoardTheme $boardTheme): bool
    {
        // 1. Se o utilizador for Admin
        if ($user->role === 'A') {
            return true;
        }
        // 2. Se o utilizador for o dono
        return $boardTheme->user_id === $user->id;
    }

    // Regras de Restauro (Passo 309)
    public function restore(User $user, BoardTheme $boardTheme): bool
    {
        if ($user->role === 'A') {
            return true;
        }
        return $boardTheme->user_id === $user->id;
    }

    // Regras de Eliminação Forçada (Passo 316)
    public function forceDelete(User $user, BoardTheme $boardTheme): bool
    {
        if ($user->role === 'A') {
            return true;
        }
        return $boardTheme->user_id === $user->id;
    }
}