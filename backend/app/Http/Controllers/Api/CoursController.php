<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CoursController extends Controller
{
    /**
     * Obtenir le programme d'une classe
     */
    public function getSchedule(Request $request, $classeId): JsonResponse
    {
        $cours = \App\Models\Cours::where('classe_id', $classeId)
            ->orderByRaw("FIELD(jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi')")
            ->orderBy('heure_debut')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cours
        ]);
    }

    /**
     * Créer un cours dans le programme
     */
    public function storeSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'jour' => 'required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'matiere' => 'required|string|max:255',
            'enseignant' => 'nullable|string|max:255',
            'matiere_id' => 'nullable|exists:matieres,id',
        ]);

        $cours = \App\Models\Cours::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Cours ajouté au programme avec succès',
            'data' => $cours
        ], 201);
    }

    /**
     * Mettre à jour un cours
     */
    public function updateSchedule(Request $request, $id): JsonResponse
    {
        $cours = \App\Models\Cours::findOrFail($id);
        
        $validated = $request->validate([
            'jour' => 'sometimes|required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut' => 'sometimes|required|date_format:H:i',
            'heure_fin' => 'sometimes|required|date_format:H:i|after:heure_debut',
            'matiere' => 'sometimes|required|string|max:255',
            'enseignant' => 'nullable|string|max:255',
            'matiere_id' => 'nullable|exists:matieres,id',
        ]);
        
        $cours->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Cours mis à jour avec succès',
            'data' => $cours
        ]);
    }

    /**
     * Supprimer un cours
     */
    public function destroySchedule($id): JsonResponse
    {
        $cours = \App\Models\Cours::findOrFail($id);
        $cours->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Cours supprimé avec succès'
        ]);
    }
}

