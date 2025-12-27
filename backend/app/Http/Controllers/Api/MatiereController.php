<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MatiereController extends Controller
{
    /**
     * Liste des matières
     */
    public function index(Request $request): JsonResponse
    {
        $query = Matiere::query();

        if ($request->has('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        if ($request->has('serie_id')) {
            $query->where('serie_id', $request->serie_id);
        }

        $matieres = $query->with(['classe', 'notes'])->get();

        return response()->json([
            'success' => true,
            'data' => $matieres
        ]);
    }

    /**
     * Créer une matière
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'nullable|string|max:10',
            'coefficient' => 'required|integer|min:1',
            'classe_id' => 'nullable|exists:classes,id',
            'serie_id' => 'nullable|exists:series,id',
        ]);

        $matiere = Matiere::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Matière créée avec succès',
            'data' => $matiere
        ], 201);
    }

    /**
     * Afficher une matière
     */
    public function show($id): JsonResponse
    {
        $matiere = Matiere::with(['classe', 'notes'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $matiere
        ]);
    }

    /**
     * Mettre à jour une matière
     */
    public function update(Request $request, $id): JsonResponse
    {
        $matiere = Matiere::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'code' => 'nullable|string|max:10',
            'coefficient' => 'sometimes|required|integer|min:1',
            'classe_id' => 'nullable|exists:classes,id',
            'serie_id' => 'nullable|exists:series,id',
        ]);

        $matiere->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Matière mise à jour avec succès',
            'data' => $matiere
        ]);
    }

    /**
     * Supprimer une matière
     */
    public function destroy($id): JsonResponse
    {
        $matiere = Matiere::findOrFail($id);
        $matiere->delete();

        return response()->json([
            'success' => true,
            'message' => 'Matière supprimée avec succès'
        ]);
    }
}

