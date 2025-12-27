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
            'classe.niveau_scolaire',
            'serie',
            'inscriptions.anneeScolaire',
            'tuteurs.user'
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
        $averageNote = Note::where('eleve_id', $id)->avg('note');

        return response()->json([
            'student' => $student,
            'recent_notes' => $recentNotes,
            'average' => $averageNote ? round($averageNote, 2) : null
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

    // ... existing methods (getDashboardStats, getTeachers, sendNotification, etc.)
}
