<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    /**
     * Afficher toutes les classes avec leurs élèves et cours associés
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $classes = Classe::with(['eleves', 'courses'])->get();

        return response()->json($classes, 200);
    }

    /**
     * Créer une nouvelle classe
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validation flexible pour supporter l'ancien front (niveau) et le nouveau (niveau_id)
        $rules = [
            'nom'            => 'required|string',
            'description'    => 'nullable|string',
            'annee_scolaire' => 'required|string',
        ];

        if ($request->has('niveau_id')) {
            $rules['niveau_id'] = 'required|integer|exists:niveaux_scolaires,id';
        } else {
            $rules['niveau'] = 'required|string';
        }

        $data = $request->validate($rules);

        // Si on a reçu 'niveau' au lieu de 'niveau_id', on tente la résolution
        if (!isset($data['niveau_id']) && isset($data['niveau'])) {
            $niveau = \App\Models\NiveauScolaire::where('nom', $data['niveau'])->first();
            if ($niveau) {
                $data['niveau_id'] = $niveau->id;
            } else {
                return response()->json([
                    'message' => "Le niveau scolaire '{$data['niveau']}' n'a pas été trouvé. Veuillez utiliser un ID valide."
                ], 422);
            }
            unset($data['niveau']);
        }

        $classe = Classe::create($data);

        return response()->json($classe, 201);
    }

    /**
     * Afficher une classe spécifique avec ses élèves et cours
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $classe = Classe::with(['eleves', 'courses'])->findOrFail($id);

        return response()->json($classe, 200);
    }

    /**
     * Mettre à jour les informations d'une classe
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $classe = Classe::findOrFail($id);

        $rules = [
            'nom'            => 'required|string',
            'description'    => 'nullable|string',
            'annee_scolaire' => 'required|string',
        ];

        if ($request->has('niveau_id')) {
            $rules['niveau_id'] = 'required|integer|exists:niveaux_scolaires,id';
        } else if ($request->has('niveau')) {
            $rules['niveau'] = 'required|string';
        }

        $validatedData = $request->validate($rules);

        // Résolution de niveau -> niveau_id si nécessaire
        if (!isset($validatedData['niveau_id']) && isset($validatedData['niveau'])) {
            $niveau = \App\Models\NiveauScolaire::where('nom', $validatedData['niveau'])->first();
            if ($niveau) {
                $validatedData['niveau_id'] = $niveau->id;
            }
            unset($validatedData['niveau']);
        }

        $classe->update($validatedData);

        return response()->json($classe, 200);
    }

    /**
     * Supprimer une classe
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $classe = Classe::findOrFail($id);
        $classe->delete();

        return response()->json(['message' => 'Classe supprimée avec succès.'], 200);
    }
}
