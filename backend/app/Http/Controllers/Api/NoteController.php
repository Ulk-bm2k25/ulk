<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Liste des notes
     */
    public function index(Request $request): JsonResponse
    {
        $query = Note::with(['eleve', 'matiere', 'semestre']);

        if ($request->has('classe_id')) {
            $query->whereHas('eleve', function($q) use ($request) {
                $q->where('classe_id', $request->classe_id);
            });
        }

        if ($request->has('matiere_id')) {
            $query->where('matiere_id', $request->matiere_id);
        }

        if ($request->has('semestre_id')) {
            $query->where('semestre_id', $request->semestre_id);
        }

        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        $notes = $query->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Créer une note
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'matiere_id' => 'required|exists:matieres,id',
            'semestre_id' => 'required|exists:semestres,id',
            'valeur' => 'required|numeric|min:0|max:20',
            'date_note' => 'nullable|date',
        ]);

        $note = Note::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Note enregistrée avec succès',
            'data' => $note->load(['eleve', 'matiere', 'semestre'])
        ], 201);
    }

    /**
     * Créer plusieurs notes en masse
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'required|array',
            'notes.*.eleve_id' => 'required|exists:eleves,id',
            'notes.*.matiere_id' => 'required|exists:matieres,id',
            'notes.*.semestre_id' => 'required|exists:semestres,id',
            'notes.*.valeur' => 'required|numeric|min:0|max:20',
        ]);

        $notes = [];
        foreach ($validated['notes'] as $noteData) {
            $notes[] = Note::create($noteData);
        }

        return response()->json([
            'success' => true,
            'message' => count($notes) . ' note(s) enregistrée(s) avec succès',
            'data' => $notes
        ], 201);
    }

    /**
     * Calculer la moyenne d'un élève
     */
    public function calculateAverage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'semestre_id' => 'required|exists:semestres,id',
        ]);

        $notes = Note::where('eleve_id', $validated['eleve_id'])
            ->where('semestre_id', $validated['semestre_id'])
            ->with('matiere')
            ->get();

        $totalPoints = 0;
        $totalCoefficients = 0;

        foreach ($notes as $note) {
            $coeff = $note->matiere->coefficient ?? 1;
            $totalPoints += $note->valeur * $coeff;
            $totalCoefficients += $coeff;
        }

        $moyenne = $totalCoefficients > 0 ? $totalPoints / $totalCoefficients : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'moyenne' => round($moyenne, 2),
                'notes' => $notes
            ]
        ]);
    }

    /**
     * Mettre à jour une note
     */
    public function update(Request $request, $id): JsonResponse
    {
        $note = Note::findOrFail($id);

        $validated = $request->validate([
            'valeur' => 'sometimes|required|numeric|min:0|max:20',
            'date_note' => 'nullable|date',
        ]);

        $note->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Note mise à jour avec succès',
            'data' => $note->load(['eleve', 'matiere', 'semestre'])
        ]);
    }

    /**
     * Supprimer une note
     */
    public function destroy($id): JsonResponse
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note supprimée avec succès'
        ]);
    }
}

