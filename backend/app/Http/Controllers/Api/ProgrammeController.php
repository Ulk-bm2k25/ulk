<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
{
    /**
     * Afficher l'emploi du temps complet d'une classe
     *
     * @param int $classeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($classeId)
    {
        // Récupère tous les créneaux du programme pour la classe
        // avec les relations 'course' (cours) et 'teacher' (professeur)
        // Triés par jour puis par heure de début
        $programme = Programme::with(['course', 'teacher'])
            ->where('classe_id', $classeId)
            ->orderBy('jour')
            ->orderBy('heure_debut')
            ->get();

        return response()->json($programme, 200);
    }

    /**
     * Créer un créneau dans le programme d'une classe
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validation des données envoyées
        $data = $request->validate([
            'classe_id'    => 'required|exists:classes,id',
            'course_id'    => 'required|exists:courses,id',
            'teacher_id'   => 'required|exists:users,id',
            'jour'         => 'required|string',    // ex: lundi, mardi
            'heure_debut'  => 'required|date_format:H:i',  // ex: 08:00
            'heure_fin'    => 'required|date_format:H:i|after:heure_debut', // doit être après heure_debut
        ]);

        // Création du créneau
        $programme = Programme::create($data);

        return response()->json($programme, 201);
    }
}
