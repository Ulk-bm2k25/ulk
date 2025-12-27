<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class AttendanceReportController extends Controller
{
    /**
     * Liste des rapports de présence
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        $presences = Presence::whereHas('eleve', function($q) use ($validated) {
            $q->where('classe_id', $validated['classe_id']);
        })
        ->whereBetween('date', [$validated['date_debut'], $validated['date_fin']])
        ->with('eleve')
        ->get();

        // Calculer les statistiques
        $stats = $presences->groupBy('date')->map(function ($dayPresences) {
            return [
                'date' => $dayPresences->first()->date,
                'total' => $dayPresences->count(),
                'presents' => $dayPresences->where('statut', 'present')->count(),
                'absents' => $dayPresences->where('statut', 'absent')->count(),
                'retards' => $dayPresences->where('statut', 'late')->count(),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Générer un rapport PDF
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        // Récupérer les données
        $presences = Presence::whereHas('eleve', function($q) use ($validated) {
            $q->where('classe_id', $validated['classe_id']);
        })
        ->whereBetween('date', [$validated['date_debut'], $validated['date_fin']])
        ->with('eleve')
        ->get();

        // Calculer les statistiques globales
        $totalDays = $presences->pluck('date')->unique()->count();
        $totalPresences = $presences->where('statut', 'present')->count();
        $totalAbsences = $presences->where('statut', 'absent')->count();
        $totalRetards = $presences->where('statut', 'late')->count();

        // Générer le PDF
        $pdf = Pdf::loadView('pdf.attendance_report', [
            'presences' => $presences,
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'totalDays' => $totalDays,
            'totalPresences' => $totalPresences,
            'totalAbsences' => $totalAbsences,
            'totalRetards' => $totalRetards,
        ]);

        return $pdf->download('rapport_presence_' . $validated['date_debut'] . '_' . $validated['date_fin'] . '.pdf');
    }
}

