<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Récupérer les statistiques du tableau de bord
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $classeId = $request->query('classe_id');
            $today = Carbon::today();

            // 1. Présence du jour
            $attendanceQuery = DB::table('presences')
                ->join('eleves', 'presences.eleve_id', '=', 'eleves.id')
                ->whereDate('presences.created_at', $today);

            if ($classeId) {
                $attendanceQuery->where('eleves.classe_id', $classeId);
            }

            $totalStudents = DB::table('eleves');
            if ($classeId) {
                $totalStudents->where('classe_id', $classeId);
            }
            $totalStudents = $totalStudents->count();

            $presentCount = (clone $attendanceQuery)->where('presences.statut', 'present')->count();
            $absentCount = (clone $attendanceQuery)->where('presences.statut', 'absent')->count();
            $rate = $totalStudents > 0 ? round(($presentCount / $totalStudents) * 100, 2) : 0;

            // 2. Absences consécutives (3+)
            $consecutiveAbsences = DB::table('eleves')
                ->select('eleves.id', DB::raw('COUNT(presences.id) as absence_count'))
                ->join('presences', 'eleves.id', '=', 'presences.eleve_id')
                ->where('presences.statut', 'absent')
                ->whereDate('presences.created_at', '>=', Carbon::now()->subDays(7))
                ->when($classeId, function ($q) use ($classeId) {
                    return $q->where('eleves.classe_id', $classeId);
                })
                ->groupBy('eleves.id')
                ->having('absence_count', '>=', 3)
                ->count();

            // 3. Permissions en attente
            $pendingPermissions = DB::table('permissions')
                ->where('statut', 'en_attente')
                ->when($classeId, function ($q) use ($classeId) {
                    return $q->whereIn('eleve_id', function ($subQuery) use ($classeId) {
                        $subQuery->select('id')
                            ->from('eleves')
                            ->where('classe_id', $classeId);
                    });
                })
                ->count();

            // 4. Cours du jour
            $jourActuel = Carbon::now()->locale('fr')->isoFormat('dddd'); // Lundi, Mardi, etc.
            
            $todayCourses = DB::table('courses')
                ->join('matieres', 'courses.matiere_id', '=', 'matieres.id')
                ->select('matieres.nom as subject', 'courses.heure_debut', 'courses.heure_fin')
                ->when($classeId, function ($q) use ($classeId) {
                    return $q->where('courses.classe_id', $classeId);
                })
                ->where('courses.jour', $jourActuel)
                ->orderBy('courses.heure_debut')
                ->get()
                ->map(function ($course) {
                    return [
                        'subject' => $course->subject,
                        'time' => substr($course->heure_debut, 0, 5) . '-' . substr($course->heure_fin, 0, 5)
                    ];
                })
                ->toArray();

            $stats = [
                'attendance_today' => [
                    'present' => $presentCount,
                    'absent' => $absentCount,
                    'total' => $totalStudents,
                    'rate' => $rate
                ],
                'consecutive_absences' => [
                    'count' => $consecutiveAbsences,
                    'threshold' => 3
                ],
                'pending_permissions' => $pendingPermissions,
                'today_courses' => $todayCourses,
                'today_courses_count' => count($todayCourses)
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les activités récentes
     */
    public function getRecentActivities(Request $request)
    {
        try {
            $limit = $request->query('limit', 10);

            $activities = DB::table('presences')
                ->join('eleves', 'presences.eleve_id', '=', 'eleves.id')
                ->join('users', 'eleves.user_id', '=', 'users.id')
                ->select(
                    'presences.id',
                    'users.name',
                    'presences.statut',
                    'presences.created_at'
                )
                ->orderBy('presences.created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($activity) {
                    $type = $activity->statut === 'absent' ? 'warning' : 'success';
                    $message = $activity->statut === 'absent'
                        ? "{$activity->name} a été marqué absent"
                        : "{$activity->name} a été marqué présent";

                    return [
                        'id' => $activity->id,
                        'message' => $message,
                        'type' => $type,
                        'time' => Carbon::parse($activity->created_at)->format('H:i'),
                        'read' => false,
                        'created_at' => $activity->created_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des activités',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les élèves nécessitant attention
     */
    public function getStudentsNeedingAttention(Request $request)
    {
        try {
            $classeId = $request->query('classe_id');
            $threshold = $request->query('threshold', 3);

            $students = DB::table('eleves')
                ->join('users', 'eleves.user_id', '=', 'users.id')
                ->join('classes', 'eleves.classe_id', '=', 'classes.id')
                ->leftJoin('presences', function ($join) {
                    $join->on('eleves.id', '=', 'presences.eleve_id')
                        ->where('presences.statut', 'absent')
                        ->whereDate('presences.created_at', '>=', Carbon::now()->subDays(7));
                })
                ->select(
                    'eleves.id',
                    'users.name',
                    'users.email as parent_email',
                    'classes.nom as class',
                    DB::raw('COUNT(presences.id) as absences')
                )
                ->when($classeId, function ($q) use ($classeId) {
                    return $q->where('eleves.classe_id', $classeId);
                })
                ->groupBy('eleves.id', 'users.name', 'users.email', 'classes.nom')
                ->having('absences', '>=', $threshold)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $students
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des élèves',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        try {
            // Implémentation simple - à adapter selon votre table notifications
            DB::table('presences')
                ->where('id', $id)
                ->update(['read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marquée comme lue'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}