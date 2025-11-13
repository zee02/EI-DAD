<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Para player1, player2, winner, boardTheme

class Game extends Model
{
    use HasFactory; // Passo 6

    // Passo 3 da Worksheet 4
    protected $fillable = [
        'player1_id',
        'player2_id',
        'winner_id',
        'type',
        'status',
        'began_at',
        'ended_at',
        'total_time',
        'player1_moves',
        'player2_moves',
        'board_theme_id', // Adicionado implicitamente
    ];

    // Passo 11: Relacionamentos (BelongsTo)
    public function player1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player1_id');
    }

    public function player2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player2_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
    
    // Relacionamento com o novo BoardTheme
    public function boardTheme(): BelongsTo
    {
        return $this->belongsTo(BoardTheme::class, 'board_theme_id');
    }
}