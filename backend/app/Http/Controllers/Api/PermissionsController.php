<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Eleve;   // corrigé : Student → Eleve pour cohérence avec ton projet
use App\Models\Course;

class PermissionsController extends Controller
{
    /**
     * Afficher toutes les permissions
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Récupère toutes les permissions avec les relations Eleve et Course
        $permissions = Permission::with(['eleve', 'course'])->get();

        return response()->json($permissions, 200);
    }

    /**
     * Créer une nouvelle permission (demande d'absence)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validation des champs requis
        $data = $request->validate([
            'eleve_id'      => 'required|exists:eleves,id',
            'course_id'     => 'required|exists:courses,id',
            'absence_date'  => 'required|date',
            'raison'        => 'required|string',
            'attachment'    => 'nullable|file|max:2048', // facultatif : justificatif
        ]);

        // Gestion du fichier attaché si présent
        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')
                                          ->store('attachments', 'public');
        }

        // Création de la permission
        $permission = Permission::create($data);

        return response()->json($permission, 201);
    }

    /**
     * Mettre à jour le statut d'une permission (approuvée / rejetée)
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Récupérer la permission par ID ou échouer
        $permission = Permission::findOrFail($id);

        // Validation du statut
        $request->validate([
            'status' => 'required|in:approuvee,rejetee',
        ]);

        // Mise à jour du statut
        $permission->update([
            'status' => $request->status
        ]);

        return response()->json($permission, 200);
    }

    /**
     * Envoyer une notification pour une permission
     * (À implémenter : email, SMS, etc.)
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function notify($id)
    {
        $permission = Permission::findOrFail($id);

        // TODO : envoyer une notification (email/SMS)
        return response()->json([
            'message' => "Notification pour la permission ID {$permission->id} envoyée."
        ], 200);
    }

    /**
     * Récupérer tous les élèves
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function eleves()
    {
        return response()->json(Eleve::all(), 200);
    }

    /**
     * Récupérer tous les cours
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function courses()
    {
        return response()->json(Course::all(), 200);
    }
}
