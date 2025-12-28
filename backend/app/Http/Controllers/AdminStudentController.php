<?php
namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\Classe;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminStudentController extends Controller
{
    /**
     * Get all students with pagination, search, and filters
     */
    public function getStudents(Request $request)
    {
        // Check authorization
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = Eleve::with(['user', 'classe', 'inscriptions']);

        // Search by name or ID
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%");
            })->orWhere('id', 'like', "%{$search}%");
        }

        // Filter by class
        if ($request->has('classe_id') && $request->classe_id != '') {
            $query->where('classe_id', $request->classe_id);
        }

        // Filter by gender
        if ($request->has('sexe') && $request->sexe != '') {
            $query->where('sexe', $request->sexe);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $students = $query->paginate($perPage);

        return response()->json($students);
    }

    /**
     * Get detailed information about a specific student
     */
    public function getStudentDetails($id)
    {
        // Check authorization
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $student = Eleve::with([
            'user',
            'classe.niveauScolaire',
            'serie',
            'inscriptions.anneeScolaire',
            'inscriptions.eleve.classe',
            'tuteurs.user',
            'documents'
        ])->find($id);

        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Get recent notes (last 10)
        $recentNotes = Note::with(['matiere', 'semestre'])
            ->where('eleve_id', $id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate average
        $averageNote = Note::where('eleve_id', $id)->avg('valeur');

        // Get attendance rate
        $totalPresence = \App\Models\Attendance::where('eleve_id', $id)->count();
        $presentCount = \App\Models\Attendance::where('eleve_id', $id)->where('statut', 'present')->count();
        $attendanceRate = $totalPresence > 0 ? round(($presentCount / $totalPresence) * 100, 1) : 0;

        // Get payment info
        $totalFrais = \App\Models\Paiement::where('eleve_id', $id)->sum('montant_paye');
        $reste = 0; // TODO: Calculate from frais_types

        // Format inscriptions history
        $inscriptionsHistory = $student->inscriptions->map(function($inscription) {
            return [
                'year' => $inscription->anneeScolaire->annee ?? 'N/A',
                'class' => $inscription->eleve->classe->nom ?? 'N/A',
                'statut' => $inscription->statut
            ];
        });

        return response()->json([
            'student' => $student,
            'recent_notes' => $recentNotes,
            'average' => $averageNote ? round($averageNote, 2) : null,
            'attendance' => [
                'rate' => $attendanceRate,
                'justified' => '0h',
                'absent' => ($totalPresence - $presentCount) . 'h'
            ],
            'finance' => [
                'reste' => number_format($reste, 0, ',', ' ') . ' FCFA',
                'statut' => $reste > 0 ? 'En attente' : 'Payé'
            ],
            'inscriptions_history' => $inscriptionsHistory
        ]);
    }

    /**
     * Update student information
     */
    public function updateStudent(Request $request, $id)
    {
        // Check authorization
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'date_naissance' => 'nullable|date',
            'lieu_naissance' => 'nullable|string',
            'adresse' => 'nullable|string',
            'sexe' => 'nullable|in:M,F',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update student
        $student->update($request->only(['date_naissance', 'lieu_naissance', 'adresse', 'sexe']));

        // Update user info if provided
        if ($request->has('nom') || $request->has('prenom')) {
            $student->user->update($request->only(['nom', 'prenom']));
        }

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student->load('user')
        ]);
    }

    /**
     * Transfer student to another class
     */
    public function transferStudent(Request $request, $id)
    {
        // Check authorization
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'classe_id' => 'required|exists:classes,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $oldClassId = $student->classe_id;
        $newClassId = $request->classe_id;

        // Update student's class
        $student->classe_id = $newClassId;
        $student->save();

        $oldClass = Classe::find($oldClassId);
        $newClass = Classe::find($newClassId);

        return response()->json([
            'message' => 'Student transferred successfully',
            'student' => $student->load(['user', 'classe']),
            'transfer_details' => [
                'from' => $oldClass ? $oldClass->nom : 'N/A',
                'to' => $newClass->nom
            ]
        ]);
    }

    /**
     * Exclure un élève (désactiver)
     */
    public function excludeStudent(Request $request, $id)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $student->update(['est_actif' => false]);

        return response()->json([
            'message' => 'Élève exclu avec succès',
            'student' => $student->load('user')
        ]);
    }

    /**
     * Réactiver un élève
     */
    public function reactivateStudent($id)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $student->update(['est_actif' => true]);

        return response()->json([
            'message' => 'Élève réactivé avec succès',
            'student' => $student->load('user')
        ]);
    }

    /**
     * Supprimer définitivement un élève
     */
    public function deleteStudent($id)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        // Vérifier s'il y a des inscriptions actives
        $activeInscriptions = Inscription::where('eleve_id', $id)
            ->where('statut', 'inscrit')
            ->count();

        if ($activeInscriptions > 0) {
            return response()->json([
                'error' => 'Impossible de supprimer un élève avec des inscriptions actives'
            ], 400);
        }

        $student->delete();

        return response()->json([
            'message' => 'Élève supprimé avec succès'
        ]);
    }
}
