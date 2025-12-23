<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Récupérer tous les utilisateurs ou filtrer par rôle
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role); // Filtrer par rôle: admin, professeur, parent, eleve
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json($users, 200);
    }

    /**
     * Créer un nouvel utilisateur (admin, professeur, parent ou élève)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,professeur,parent,eleve',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Afficher les détails d’un utilisateur spécifique
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json($user, 200);
    }

    /**
     * Mettre à jour les informations d’un utilisateur
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|string',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role'     => 'sometimes|in:admin,professeur,parent,eleve',
        ]);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->update($request->only('name','email','role'));

        return response()->json($user, 200);
    }

    /**
     * Supprimer un utilisateur
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
    }
}
