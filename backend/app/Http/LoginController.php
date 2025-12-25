<?php

namespace App\Http\Controllers\app\Http;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

    // Pour SPA : Sanctum gère le cookie de session automatiquement
        return response()->json(['message' => 'Connecté', 'user' => Auth::user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Si tu utilises tokens
        // Ou juste $request->session()->invalidate(); pour session
        return response()->json(['message' => 'Déconnecté']);
    }
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
