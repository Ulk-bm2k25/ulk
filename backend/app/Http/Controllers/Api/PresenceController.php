<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class PresenceController extends Controller
{
    /**
     * 1. OUVERTURE D'UNE LISTE DE PRÉSENCE
     */
    public function getAttendanceList(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|integer|exists:classes,id',
            'date' => 'required|date'
        ]);

        $classe = Classe::findOrFail($request->classe_id);
        
        $eleves = Eleve::where('classe_id', $request->classe_id)
                      ->with(['user', 'tuteurs'])
                      ->get();
        
        $existingPresences = Presence::where('classe_id', $request->classe_id)
                                    ->whereDate('date', $request->date)
                                    ->get()
                                    ->keyBy('eleve_id');
        
        $attendanceList = [];
        foreach ($eleves as $eleve) {
            $existing = $existingPresences[$eleve->id] ?? null;
            $parent = $eleve->tuteurs->first();
            
            $attendanceList[] = [
                'eleve_id' => $eleve->id,
                'nom' => $eleve->user->name ?? 'Inconnu',
                'present' => $existing ? (bool)$existing->present : null,
                'heure' => $existing ? $existing->heure : null,
                'parent_email' => $parent->email ?? null,
                'parent_phone' => $parent->telephone ?? null
            ];
        }
        
        return response()->json([
            'success' => true,
            'classe' => [
                'id' => $classe->id,
                'nom' => $classe->nom
            ],
            'date' => $request->date,
            'eleves' => $attendanceList,
            'total' => count($eleves)
        ]);
    }

    /**
     * 2. MARQUAGE DE LA PRÉSENCE
     */
    public function markAttendance(Request $request)
    {
        $request->validate([
            'eleve_id' => 'required|integer|exists:eleves,id',
            'classe_id' => 'required|integer|exists:classes,id',
            'present' => 'required|boolean',
            'date' => 'required|date',
            'course_id' => 'nullable|integer|exists:cours,id'
        ]);
        
        $presence = Presence::updateOrCreate(
            [
                'eleve_id' => $request->eleve_id,
                'classe_id' => $request->classe_id,
                'date' => $request->date,
                'course_id' => $request->course_id
            ],
            [
                'present' => $request->present,
                'heure' => now()->format('H:i:s')
            ]
        );
        
        if (!$request->present) {
            $this->notifyAbsence($presence);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Présence enregistrée',
            'presence' => $presence
        ]);
    }

    /**
     * 3. MARQUER TOUTE LA CLASSE
     */
    public function markAllAttendance(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|integer|exists:classes,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent',
            'course_id' => 'nullable|integer|exists:cours,id'
        ]);
        
        $eleves = Eleve::where('classe_id', $request->classe_id)->get();
        $isPresent = $request->status === 'present';
        
        DB::beginTransaction();
        try {
            foreach ($eleves as $eleve) {
                Presence::updateOrCreate(
                    [
                        'eleve_id' => $eleve->id,
                        'classe_id' => $request->classe_id,
                        'date' => $request->date,
                        'course_id' => $request->course_id
                    ],
                    [
                        'present' => $isPresent,
                        'heure' => now()->format('H:i:s')
                    ]
                );
                
                if (!$isPresent) {
                    $presence = Presence::where('eleve_id', $eleve->id)
                                       ->where('date', $request->date)
                                       ->first();
                    $this->notifyAbsence($presence);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => "Tous les élèves marqués " . ($isPresent ? 'présents' : 'absents'),
                'students_updated' => $eleves->count()
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 4. GÉNÉRATION DE RAPPORT PDF
     */
    public function generateAttendanceReport(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|integer|exists:classes,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date',
            'format' => 'nullable|in:pdf,excel'
        ]);
        
        $classe = Classe::findOrFail($request->classe_id);
        $dateFin = $request->date_fin ?? $request->date_debut;
        
        $presences = Presence::where('classe_id', $request->classe_id)
                            ->whereBetween('date', [$request->date_debut, $dateFin])
                            ->with(['eleve.user', 'course.matiere'])
                            ->get()
                            ->groupBy('date');
        
        $stats = [
            'total_jours' => $presences->count(),
            'total_presences' => 0,
            'total_absences' => 0,
            'taux_presence' => 0
        ];
        
        foreach ($presences as $date => $dayPresences) {
            $stats['total_presences'] += $dayPresences->where('present', true)->count();
            $stats['total_absences'] += $dayPresences->where('present', false)->count();
        }
        
        if (($stats['total_presences'] + $stats['total_absences']) > 0) {
            $stats['taux_presence'] = round(
                ($stats['total_presences'] / ($stats['total_presences'] + $stats['total_absences'])) * 100, 
                2
            );
        }
        
        $data = [
            'classe' => $classe,
            'date_debut' => $request->date_debut,
            'date_fin' => $dateFin,
            'presences' => $presences,
            'stats' => $stats,
            'generated_at' => now()->format('d/m/Y H:i')
        ];
        
        $pdf = Pdf::loadView('reports.attendance', $data);
        
        $filename = 'presence_' . $classe->nom . '_' . $request->date_debut . '_' . $dateFin . '.pdf';
        $path = storage_path('app/public/reports/' . $filename);
        $pdf->save($path);
        
        return response()->json([
            'success' => true,
            'message' => 'Rapport généré avec succès',
            'report_url' => url('storage/reports/' . $filename),
            'download_url' => route('download.report', ['filename' => $filename]),
            'file_size' => round(filesize($path) / 1024, 2) . ' KB'
        ]);
    }

    /**
     * 5. TÉLÉCHARGER LE RAPPORT
     */
    public function downloadReport($filename)
    {
        $path = storage_path('app/public/reports/' . $filename);
        
        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé'
            ], 404);
        }
        
        return response()->download($path);
    }

    /**
     * 6. NOTIFICATION D'ABSENCE (Route API)
     */
    public function notify(Request $request)
    {
        $request->validate([
            'eleve_id' => 'required|integer|exists:eleves,id',
            'date' => 'required|date',
            'type' => 'required|string|in:absence,permission'
        ]);

        $eleve = Eleve::findOrFail($request->eleve_id);
        $parent = $eleve->tuteurs->first() ?? null;

        if (!$parent) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun parent trouvé pour cet élève'
            ], 404);
        }

        // Simuler l'envoi
        \Log::info("Notification {$request->type} envoyée à {$parent->email} pour {$eleve->user->name}");

        return response()->json([
            'success' => true,
            'message' => 'Notification envoyée avec succès'
        ]);
    }

    /**
     * 7. STATISTIQUES DE PRÉSENCE
     */
    public function getAttendanceStats(Request $request)
    {
        $request->validate([
            'classe_id' => 'nullable|integer|exists:classes,id',
            'periode' => 'nullable|in:today,week,month'
        ]);
        
        $query = Presence::query();
        
        if ($request->classe_id) {
            $query->where('classe_id', $request->classe_id);
        }
        
        switch ($request->periode) {
            case 'today':
                $query->whereDate('date', now()->format('Y-m-d'));
                break;
            case 'week':
                $query->whereBetween('date', [
                    now()->startOfWeek()->format('Y-m-d'),
                    now()->endOfWeek()->format('Y-m-d')
                ]);
                break;
            case 'month':
                $query->whereBetween('date', [
                    now()->startOfMonth()->format('Y-m-d'),
                    now()->endOfMonth()->format('Y-m-d')
                ]);
                break;
        }
        
        $presences = $query->get();
        
        $stats = [
            'total' => $presences->count(),
            'presents' => $presences->where('present', true)->count(),
            'absents' => $presences->where('present', false)->count(),
            'taux_presence' => $presences->count() > 0 
                ? round(($presences->where('present', true)->count() / $presences->count()) * 100, 2)
                : 0
        ];
        
        return response()->json([
            'success' => true,
            'periode' => $request->periode ?? 'all',
            'stats' => $stats
        ]);
    }
    
    /**
     * Récupérer les cours d'une classe pour une date spécifique
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCoursesOfDay(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|integer|exists:classes,id',
            'date' => 'required|date'
        ]);

        // Convertir la date en jour de la semaine (Lundi, Mardi...)
        $date = \Carbon\Carbon::parse($request->date);
        $days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        $dayOfWeek = $days[$date->dayOfWeek];

        $courses = Course::where('classe_id', $request->classe_id)
                        ->where('jour', $dayOfWeek)
                        ->get(['id', 'matiere_id', 'heure_debut', 'heure_fin']);

        // Charger la relation matière pour avoir le nom
        foreach($courses as $course) {
             $course->subject = $course->matiere->nom ?? 'Cours';
        }

        return response()->json([
            'success' => true,
            'courses' => $courses
        ]);
    }
}