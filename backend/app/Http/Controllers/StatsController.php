<?php

namespace App\Http\Controllers;

use App\Services\StatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    protected StatsService $statsService;

    public function __construct(StatsService $statsService)
    {
        $this->statsService = $statsService;
    }

    /**
     * Obtenir toutes les statistiques d'une classe
     * GET /api/stats/{classeId}?periode=TRIMESTRE_1&annee_scolaire=2024-2025
     */
    public function index(Request $request, int $classeId): JsonResponse
    {
        $request->validate([
            'periode' => 'required|string|in:TRIMESTRE_1,TRIMESTRE_2,TRIMESTRE_3',
            'annee_scolaire' => 'required|string',
        ]);

        $periode = $request->input('periode');
        $anneeScolaire = $request->input('annee_scolaire');

        // Déterminer la période précédente
        $periodePrecedente = match($periode) {
            'TRIMESTRE_2' => 'TRIMESTRE_1',
            'TRIMESTRE_3' => 'TRIMESTRE_2',
            default => null,
        };

        $data = [
            'generales' => $this->statsService->getStatsGenerales($classeId),
            'academiques' => $this->statsService->getStatsAcademiques($classeId, $periode, $anneeScolaire),
            'repartition' => $this->statsService->getRepartitionNotes($classeId, $periode, $anneeScolaire),
            'discipline' => $this->statsService->getStatsDiscipline($classeId),
        ];

        if ($periodePrecedente) {
            $data['progression'] = $this->statsService->getStatsProgression(
                $classeId, 
                $periode, 
                $periodePrecedente, 
                $anneeScolaire
            );
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Stats générales uniquement
     */
    public function generales(int $classeId): JsonResponse
    {
        $stats = $this->statsService->getStatsGenerales($classeId);

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Stats académiques uniquement
     */
    public function academiques(Request $request, int $classeId): JsonResponse
    {
        $request->validate([
            'periode' => 'required|string',
            'annee_scolaire' => 'required|string',
        ]);

        $stats = $this->statsService->getStatsAcademiques(
            $classeId,
            $request->input('periode'),
            $request->input('annee_scolaire')
        );

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}