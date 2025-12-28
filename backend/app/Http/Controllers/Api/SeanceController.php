<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    /**
     * Afficher toutes les séances avec leur cours associé
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Récupère toutes les séances et charge la relation 'course' pour éviter le problème N+1
        $seances = Seance::with('course')->get();

        return response()->json($seances, 200);
    }

    /**
     * Créer une nouvelle séance pour un cours
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validation des données entrantes
        $data = $request->validate([
            'course_id'   => 'required|exists:courses,id',
            'date'        => 'required|date',                  // ex: 2025-12-24
            'heure_debut' => 'required|date_format:H:i',      // ex: 08:00
            'heure_fin'   => 'required|date_format:H:i|after:heure_debut', // doit être après heure_debut
        ]);

        // Création de la séance
        $seance = Seance::create($data);

        return response()->json($seance, 201);
    }

    /**
     * Afficher une séance spécifique avec son cours et les présences
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $seance = Seance::with(['course', 'presences'])->findOrFail($id);

        return response()->json($seance, 200);
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    /**
     * (Optionnel) Mettre à jour une séance
     * (À implémenter plus tard)
     */
    // public function update(Request $request, $id) { ... }

    /**
     * (Optionnel) Supprimer une séance
     * (À implémenter plus tard)
     */
    // public function destroy($id) { ... }
}
