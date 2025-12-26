<?php
namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\Classe;
use App\Models\Enseignant;
use App\Models\Attendance;
use App\Models\Note;
use App\Models\User;
use App\Models\ParentTuteur;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Send notification to targets.
     */
    public function sendNotification(Request $request)
    {
        $request->validate([
            'targetType' => 'required|in:all,class,student',
            'subject' => 'required|string',
            'message' => 'required|string',
            'channels' => 'required|array'
        ]);

        $targetType = $request->targetType;
        $targetId = $request->targetId; 
        $subject = $request->subject;
        $message = $request->message;

        $userIds = [];

        if ($targetType === 'all') {
            $userIds = User::whereIn('role', ['PARENT', 'ENSEIGNANT'])->pluck('id')->toArray();
        } elseif ($targetType === 'class') {
            $classe = Classe::where('nom', $targetId)->first();
            if ($classe) {
                // Get all students in the class and then their parent's user IDs
                $eleves = $classe->eleves()->with('tuteurs.user')->get();
                foreach ($eleves as $eleve) {
                    foreach ($eleve->tuteurs as $tuteur) {
                        if ($tuteur->user) {
                            $userIds[] = $tuteur->user->id;
                        }
                    }
                }
                $userIds = array_unique($userIds);
            }
        } elseif ($targetType === 'student') {
            // targetId is the student's user_id or student record ID
            $eleve = Eleve::with('tuteurs.user')->find($targetId) ?? Eleve::where('user_id', $targetId)->with('tuteurs.user')->first();
            if ($eleve) {
                foreach ($eleve->tuteurs as $tuteur) {
                    if ($tuteur->user) {
                        $userIds[] = $tuteur->user->id;
                    }
                }
            }
        }

        foreach ($userIds as $uid) {
            Notification::create([
                'user_id' => auth()->id(),
                'destinataire_id' => $uid,
                'type' => $request->input('type', 'info'),
                'message' => $subject . ": " . $message,
                'lu' => false,
                'date_envoi' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Notification envoyée avec succès à ' . count($userIds) . ' utilisateurs.',
            'count' => count($userIds)
        ]);
    }

    /**
     * Get history of sent notifications.
     */
    public function getNotificationsHistory()
    {
        // Get unique messages sent (grouped by content/subject) for admin history
        // Or just list all individual notifications, but formatted for easy viewing
        $notifications = Notification::with('recipient')
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json($notifications);
    }

    /**
     * Get dashboard statistics for the admin.
     */
    public function getDashboardStats()
    {
        try {
            $totalStudents = Eleve::count();
            $pendingInscriptions = Inscription::where('statut', 'en attente')->count();
            
            // Attendance Rate
            $totalAttendance = Attendance::count();
            $presentAttendance = Attendance::where('present', true)->count();
            $attendanceRate = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 0;

            // Saturated Classes
            $saturatedClasses = Classe::withCount('eleves')->get()->filter(function ($classe) {
                return $classe->eleves_count > $classe->capacity_max;
            })->count();

            return response()->json([
                'totalStudents' => $totalStudents,
                'pendingInscriptions' => $pendingInscriptions,
                'attendanceRate' => $attendanceRate,
                'saturatedClasses' => $saturatedClasses
            ]);
        } catch (\Exception $e) {
            // Return safe defaults if any error occurs
            return response()->json([
                'totalStudents' => 0,
                'pendingInscriptions' => 0,
                'attendanceRate' => 0,
                'saturatedClasses' => 0
            ]);
        }
    }

    /**
     * Get list of all students with search, filters, and pagination.
     */
    public function getStudents(Request $request)
    {
        $query = Eleve::with(['user', 'classe.niveauScolaire', 'inscriptions']);

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
        $student = Eleve::find($id);
        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
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
     * Get list of all teachers.
     */
    public function getTeachers()
    {
        $teachers = Enseignant::with('user')->get();
        return response()->json(['teachers' => $teachers]);
    }
}
