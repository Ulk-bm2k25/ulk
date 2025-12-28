<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ParentTuteur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'username' => $request->username,
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
                'role' => 'PARENT',
            ]);

            ParentTuteur::create([
                'user_id' => $user->id,
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->phone,
                'email' => $request->email,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            // Merge profile for frontend
            $user->phone = $request->phone;
            $user->adresse = $request->parentAddress ?? null;
            $user->profession = $request->parentProfession ?? null;

            return response()->json([
                'message' => 'Compte parent créé avec succès',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        });
    }
}
