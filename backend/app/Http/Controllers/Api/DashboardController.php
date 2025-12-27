<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Presence;
use App\Models\Eleve;
use App\Models\Classe;
use App\Models\Permission;
use App\Models\Notification as AppNotification;
use App\Models\Course;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * STATISTIQUES DU DASHBOARD
     */
    public function getDashboardStats(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $classeId = $request->query('classe_id');

        // Présences du jour
        $query = Presence::whereDate('date', $today);
        if ($classeId) {
            $query->where('classe_id', $classeId);
        }
        $todayPresences = $query->get();

        $attendanceToday = [
            'present' => $todayPresences->where('present', true)->count(),
            'absent'  => $todayPresences->where('present', false)->count(),
            'total'   => $todayPresences->count(),
            'rate'    => $todayPresences->count() > 0
                ? round(($todayPresences->where('present', true)->count() / $todayPresences->count()) * 100)
                : 0
        ];

        // Absences consécutives
        $studentsWithConsecutiveAbsences = $this->getStudentsWithConsecutiveAbsences(3, $classeId);

        // Permissions en attente (DYNAMIQUE)
        $pendingPermissions = Permission::where('status', 'en_attente')->count();

        // Cours du jour (BASÉ SUR LE PLANNING HEBDOMADAIRE)
        // Utiliser l'index du jour pour éviter les problèmes de locale
        $daysSub = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        $dayName = $daysSub[Carbon::today()->dayOfWeek];

        $coursesQuery = Course::where('jour', $dayName);
        if ($classeId) {
            $coursesQuery->where('classe_id', $classeId);
        }

        $coursesOfDay = $coursesQuery->with('matiere')
            ->get()
            ->map(function ($course) {
                return [
                    'subject' => $course->matiere?->nom ?? '—',
                    'time' => ($course->heure_debut ? substr($course->heure_debut, 0, 5) : '??:??') . 
                             ' - ' . 
                             ($course->heure_fin ? substr($course->heure_fin, 0, 5) : '??:??')
                ];
            });

        return response()->json([
            'attendance_today' => $attendanceToday,
            'consecutive_absences' => [
                'count' => $studentsWithConsecutiveAbsences->count(),
                'threshold' => 3
            ],
            'pending_permissions' => $pendingPermissions,
            'today_courses' => $coursesOfDay,
            'today_courses_count' => $coursesOfDay->count()
        ]);
    }
    
    /**
     * ÉLÈVES AYANT BESOIN D'ATTENTION
     */
    public function getStudentsNeedingAttention(Request $request)
    {
        $classeId = $request->query('classe_id');
        $students = $this->getStudentsWithConsecutiveAbsences(3, $classeId);
        
        $studentsData = [];
        foreach ($students as $eleve) {
            $parent = $eleve->tuteurs->first();
            $studentsData[] = [
                'id' => $eleve->id,
                'name' => $eleve->user?->name ?? 'Nom inconnu',
                'absences' => $eleve->presences()->where('present', false)->count(),
                'class' => $eleve->classe?->nom ?? 'Classe inconnue',
                'parent_email' => $parent?->email ?? 'parent@example.com',
                'parent_phone' => $parent?->telephone ?? '+229 00 00 00 00'
            ];
        }
        
        return response()->json($studentsData);
    }
    
    /**
     * ACTIVITÉS RÉCENTES
     */
    public function getRecentActivities(Request $request)
    {
        $user = $request->user();

        // 1. Récupérer les notifications de la table 'notifications'
        $notifications = AppNotification::where('destinataire_id', $user->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'is_notification' => true,
                    'type' => $n->type,
                    'message' => $n->message,
                    'read' => $n->lu,
                    'created_at' => $n->created_at
                ];
            });

        // 2. Récupérer les permissions (fallback/historique)
        $permissions = Permission::latest()
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => "perm_" . $p->id,
                    'is_notification' => false,
                    'type' => 'info',
                    'message' => 'Demande de permission: ' . ($p->eleve->user->name ?? 'Élève'),
                    'read' => false,
                    'created_at' => $p->created_at
                ];
            });

        return response()->json($notifications->merge($permissions)->sortByDesc('created_at')->values());
    }

    /**
     * MARQUER UNE NOTIFICATION COMME LUE
     */
    public function markAsRead($id)
    {
        $notification = AppNotification::find($id);
        if ($notification) {
            $notification->update(['lu' => true]);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Notification non trouvée'], 404);
    }
    
    /**
     * Méthode privée : détecter les absences consécutives
     */
    private function getStudentsWithConsecutiveAbsences($threshold, $classeId = null)
    {
        $query = Eleve::whereHas('presences', function ($q) {
                $q->where('present', false)
                ->whereDate('date', '>=', Carbon::today()->subDays(7));
            }, '>=', $threshold);
            
        if ($classeId) {
            $query->where('classe_id', $classeId);
        }

        return $query->with([
                'user',
                'classe',
                'tuteurs',
                'presences' => function ($q) {
                    $q->where('present', false);
                }
            ])
            ->take(10)
            ->get();
    }

}