<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Eleve;
use App\Models\Course;

class PermissionsController extends Controller
{
    /**
     * Mapping des status frontend → backend
     */
    private $statusMap = [
        'pending' => 'en_attente',
        'approved' => 'approuvee',
        'rejected' => 'rejetee',
    ];

    /**
     * Mapping inverse backend → frontend
     */
    private $statusMapReverse = [
        'en_attente' => 'pending',
        'approuvee' => 'approved',
        'rejetee' => 'rejected',
    ];

    /**
     * Afficher toutes les permissions
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $permissions = Permission::with(['eleve.user', 'course'])->get();

        // Transformer les données pour le frontend
        $transformed = $permissions->map(function ($permission) {
            return $this->transformPermission($permission);
        });

        return response()->json($transformed, 200);
    }

    /**
     * Afficher une permission spécifique
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $permission = Permission::with(['eleve.user', 'course'])->findOrFail($id);
        
        return response()->json($this->transformPermission($permission), 200);
    }

    /**
     * Créer une nouvelle permission (demande d'absence)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validation des champs (accepte les noms frontend)
        $request->validate([
            'student_id'    => 'required|exists:eleves,id',
            'course_id'     => 'required|exists:cours,id',
            'absence_date'  => 'required|date',
            'reason'        => 'required|string',
            'attachment'    => 'nullable|file|max:2048',
        ]);

        // Mapper les champs frontend → backend
        $data = [
            'eleve_id'     => $request->student_id,
            'course_id'    => $request->course_id,
            'absence_date' => $request->absence_date,
            'raison'       => $request->reason,
            'status'       => 'en_attente',
        ];

        // Gestion du fichier attaché si présent
        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')
                                          ->store('attachments', 'public');
        }

        // Création de la permission
        $permission = Permission::create($data);
        $permission->load(['eleve.user', 'course']);

        return response()->json($this->transformPermission($permission), 201);
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
        $permission = Permission::findOrFail($id);

        // Validation du statut (accepte les status en anglais)
        $request->validate([
            'status' => 'required|in:approved,rejected,pending,approuvee,rejetee,en_attente',
        ]);

        // Mapper le status si nécessaire
        $status = $request->status;
        if (isset($this->statusMap[$status])) {
            $status = $this->statusMap[$status];
        }

        $permission->update(['status' => $status]);
        $permission->load(['eleve.user', 'course']);

        return response()->json($this->transformPermission($permission), 200);
    }

    /**
     * Supprimer une permission
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permission supprimée'], 200);
    }

    /**
     * Envoyer une notification pour une permission
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function notify($id)
    {
        $permission = Permission::with(['eleve.user', 'course'])->findOrFail($id);

        // TODO : implémenter l'envoi de notification (email/SMS)
        
        return response()->json([
            'success' => true,
            'message' => "Notification pour la permission ID {$permission->id} envoyée."
        ], 200);
    }

    /**
     * Récupérer tous les élèves (route /students)
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function students()
    {
        $eleves = Eleve::with('user')->get();

        // Transformer pour le frontend
        $transformed = $eleves->map(function ($eleve) {
            return [
                'id' => $eleve->id,
                'name' => $eleve->user ? $eleve->user->name : 'Inconnu',
                'class' => $eleve->classe_id,
            ];
        });

        return response()->json($transformed, 200);
    }

    /**
     * Récupérer tous les cours
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function courses()
    {
        $courses = Course::all();

        // Transformer pour le frontend
        $transformed = $courses->map(function ($course) {
            return [
                'id' => $course->id,
                'subject' => $course->subject,
            ];
        });

        return response()->json($transformed, 200);
    }

    /**
     * Transformer une permission pour le format frontend
     */
    private function transformPermission($permission)
    {
        return [
            'id' => $permission->id,
            'status' => $this->statusMapReverse[$permission->status] ?? $permission->status,
            'absence_date' => $permission->absence_date,
            'reason' => $permission->raison,
            'attachment' => $permission->attachment,
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
            'student' => $permission->eleve ? [
                'id' => $permission->eleve->id,
                'name' => $permission->eleve->user ? $permission->eleve->user->name : 'Inconnu',
                'class' => $permission->eleve->classe_id,
            ] : null,
            'course' => $permission->course ? [
                'id' => $permission->course->id,
                'subject' => $permission->course->subject,
            ] : null,
        ];
    }
}
