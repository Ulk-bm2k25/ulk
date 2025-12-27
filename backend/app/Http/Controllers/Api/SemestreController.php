<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semestre;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SemestreController extends Controller
{
    /**
     * Liste des semestres/trimestres
     */
    public function index(): JsonResponse
    {
        $semestres = Semestre::orderBy('date_debut')->get();

        return response()->json([
            'success' => true,
            'data' => $semestres
        ]);
    }

    /**
     * Créer un semestre/trimestre
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $semestre = Semestre::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Période créée avec succès',
            'data' => $semestre
        ], 201);
    }

    /**
     * Mettre à jour un semestre/trimestre
     */
    public function update(Request $request, $id): JsonResponse
    {
        $semestre = Semestre::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after:date_debut',
        ]);

        $semestre->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Période mise à jour avec succès',
            'data' => $semestre
        ]);
    }

    /**
     * Supprimer un semestre/trimestre
     */
    public function destroy($id): JsonResponse
    {
        $semestre = Semestre::findOrFail($id);
        $semestre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Période supprimée avec succès'
        ]);
    }
}

