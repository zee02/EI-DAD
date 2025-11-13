<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // <-- Novo import

abstract class Controller
{
    use AuthorizesRequests; // <-- Adicionar trait
}
