<?php
namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\Classe;
use App\Models\Enseignant;
use App\Models\Attendance;
use App\Models\User;
use App\Models\ParentTuteur;
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
                $userIds = $classe->eleves()->pluck('user_id')->toArray();
            }
        } elseif ($targetType === 'student') {
            $userIds = [$targetId];
        }

        foreach ($userIds as $uid) {
            DB::table('notifications')->insert([
                'user_id' => auth()->id(),
                'destinataire_id' => $uid,
                'type' => 'info',
                'message' => $subject . ": " . $message,
                'lu' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        return response()->json(['message' => 'Notification envoyée avec succès to ' . count($userIds) . ' users.']);
    }

    /**
     * Get dashboard statistics for the admin.
     */
    public function getDashboardStats()
    {
        $totalStudents = Eleve::count();
        $pendingInscriptions = Inscription::where('statut', 'en attente')->count();
        
        // Simple attendance rate calculation (e.g. for last 30 days)
        $totalAttendance = Attendance::count();
        $presentCount = Attendance::where('present', true)->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100) : 0;

        $saturatedClasses = Classe::all()->filter(function($c) {
            return $c->eleves()->count() >= ($c->capacite ?? 40); // Default capacity 40
        })->count();

        return response()->json([
            'totalStudents' => $totalStudents,
            'pendingInscriptions' => $pendingInscriptions,
            'attendanceRate' => $attendanceRate,
            'saturatedClasses' => $saturatedClasses
        ]);
    }

    /**
     * Get list of all students.
     */
    public function getStudents()
    {
        $students = Eleve::with(['user', 'classe.niveauScolaire'])->get();
        return response()->json(['students' => $students]);
    }

    /**
     * Get list of all teachers.
     */
    public function getTeachers()
    {
        $teachers = Enseignant::all();
        return response()->json(['teachers' => $teachers]);
    }
}
