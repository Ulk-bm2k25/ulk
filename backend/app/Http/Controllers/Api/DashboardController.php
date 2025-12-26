<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Presence;
use App\Models\Eleve;
use App\Models\Classe;
use App\Models\Permission;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * STATISTIQUES DU DASHBOARD
     */
    public function getDashboardStats()
{
    $today = Carbon::today()->format('Y-m-d');

    // Présences du jour
    $todayPresences = Presence::whereDate('date', $today)->get();

    $attendanceToday = [
        'present' => $todayPresences->where('present', true)->count(),
        'absent'  => $todayPresences->where('present', false)->count(),
        'total'   => $todayPresences->count(),
        'rate'    => $todayPresences->count() > 0
            ? round(($todayPresences->where('present', true)->count() / $todayPresences->count()) * 100)
            : 0
    ];

    // Absences consécutives
    $studentsWithConsecutiveAbsences = $this->getStudentsWithConsecutiveAbsences(3);

    // Permissions en attente (DYNAMIQUE)
    $pendingPermissions = Permission::where('status', 'en_attente')->count();

    // Cours du jour (DYNAMIQUE)
    $todayCourses = \App\Models\Seance::whereDate('date', $today)
        ->with('cours')
        ->get()
        ->map(function ($seance) {
            return [
                'subject' => $seance->cours->subject ?? '—',
                'time' => $seance->heure_debut . ' - ' . $seance->heure_fin
            ];
        });

    return response()->json([
        'attendance_today' => $attendanceToday,
        'consecutive_absences' => [
            'count' => $studentsWithConsecutiveAbsences->count(),
            'threshold' => 3
        ],
        'pending_permissions' => $pendingPermissions,
        'today_courses' => $todayCourses,
        'today_courses_count' => $todayCourses->count()
    ]);
}
    
    /**
     * ÉLÈVES AYANT BESOIN D'ATTENTION
     */
    public function getStudentsNeedingAttention()
    {
        $students = $this->getStudentsWithConsecutiveAbsences(3);
        
        $studentsData = [];
        foreach ($students as $eleve) {
            $studentsData[] = [
                'id' => $eleve->id,
                'name' => $eleve->user->name ?? 'Nom inconnu',
                'absences' => $eleve->presences->where('present', false)->count(),
                'class' => $eleve->classe->nom ?? 'Classe inconnue',
                'parent_email' => $eleve->parentTuteur->email ?? 'parent@example.com',
                'parent_phone' => $eleve->parentTuteur->telephone ?? '+229 00 00 00 00'
            ];
        }
        
        return response()->json($studentsData);
    }
    
    /**
     * ACTIVITÉS RÉCENTES
     */
    public function getRecentActivities()
    {
        $activities = Permission::latest()
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'info',
                    'message' => 'Nouvelle demande de permission',
                    'created_at' => $p->created_at
                ];
            });

        return response()->json($activities);
    }
    
    /**
     * Méthode privée : détecter les absences consécutives
     */
    private function getStudentsWithConsecutiveAbsences($threshold)
    {
        return Eleve::whereHas('presences', function ($q) {
                $q->where('present', false)
                ->whereDate('date', '>=', Carbon::today()->subDays(7));
            }, '>=', $threshold)
            ->with([
                'user',
                'classe',
                'parentTuteur',
                'presences' => function ($q) {
                    $q->where('present', false);
                }
            ])
            ->take(10)
            ->get();
    }

}