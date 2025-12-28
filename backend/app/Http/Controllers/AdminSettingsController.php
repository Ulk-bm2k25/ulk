<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ParentTuteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminSettingsController extends Controller
{
    /**
     * Obtenir le profil de l'admin
     */
    public function getProfile()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Mettre à jour les données personnelles
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'required|string|unique:users,username,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['nom', 'prenom', 'email', 'username']));

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->current_password, $user->password_hash)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }

        $user->update([
            'password_hash' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    /**
     * Créer un nouvel administrateur
     */
    public function createAdmin(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:ADMIN,RESPONSABLE',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newAdmin = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'username' => $request->username,
            'password_hash' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        // Log activity
        DB::table('logs_activite')->insert([
            'user_id' => $user->id,
            'action' => 'create_admin',
            'details' => "Création d'un nouvel administrateur: {$newAdmin->email}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Administrateur créé avec succès',
            'admin' => $newAdmin
        ], 201);
    }

    /**
     * Lister tous les administrateurs
     */
    public function listAdmins()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $admins = User::whereIn('role', ['ADMIN', 'RESPONSABLE'])
            ->select('id', 'nom', 'prenom', 'email', 'username', 'role', 'created_at')
            ->get();

        return response()->json(['admins' => $admins]);
    }
}

