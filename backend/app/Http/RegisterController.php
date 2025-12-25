<?php

namespace App\Http\Controllers\app;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            // Ajoute champs spécifiques aux parents si besoin (ex. enfant_id, etc.)
        ]);
        $user = User::create([ // ou Parent::create si modèle custom

            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'role' => 'parent', si tu gères des rôles
        ]);
    return response()->json(['message' => 'Inscrit avec succès', 'user' => $user]);
}
}
