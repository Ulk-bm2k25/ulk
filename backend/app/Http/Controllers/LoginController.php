<?php

namespace App\Http\Controllers;

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

        \Illuminate\Support\Facades\Log::info('Login attempt', ['email' => $request->email, 'password_length' => strlen($request->password)]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            \Illuminate\Support\Facades\Log::warning('Login failed for email: ' . $request->email);
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }
        
        \Illuminate\Support\Facades\Log::info('Login successful for: ' . $request->email);

        $user = Auth::user();
        
        // Load parent profile if applicable
        if ($user->role === 'PARENT') {
            $profile = \App\Models\ParentTuteur::where('user_id', $user->id)->first();
            if ($profile) {
                $user->phone = $profile->telephone;
                $user->adresse = $profile->adresse;
                $user->profession = $profile->profession;
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connecté',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
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
