<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Eleve;

class EleveController extends Controller
{
    /**
     * Récupérer tous les élèves avec leurs relations
     *
     * Relations chargées : user, classe, permissions
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $eleves = Eleve::with(['user', 'classe', 'permissions'])->get();

        return response()->json($eleves, 200);
    }

    /**
     * Récupérer un élève spécifique par ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $eleve = Eleve::with(['user', 'classe', 'permissions'])->findOrFail($id);

        return response()->json($eleve, 200);
    }

    /**
     * Créer un nouvel élève
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'classe_id' => 'required|exists:classes,id',
            'serie_id'  => 'nullable|exists:series,id',
        ]);

        $eleve = Eleve::create($data);

        return response()->json($eleve, 201);
    }

    /**
     * Mettre à jour les informations d'un élève
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $eleve = Eleve::findOrFail($id);

        $data = $request->validate([
            'user_id'   => 'sometimes|exists:users,id',
            'classe_id' => 'sometimes|exists:classes,id',
            'serie_id'  => 'sometimes|nullable|exists:series,id',
        ]);

        $eleve->update($data);

        return response()->json($eleve, 200);
    }

    /**
     * Supprimer un élève
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $eleve = Eleve::findOrFail($id);
        $eleve->delete();

        return response()->json(['message' => 'Élève supprimé avec succès'], 200);
    }


}
