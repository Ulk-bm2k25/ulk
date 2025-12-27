<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PresenceController extends Controller
{
    /**
     * Liste des présences
     */
    public function index(Request $request): JsonResponse
    {
        $query = Presence::with(['eleve']);

        if ($request->has('classe_id')) {
            $query->whereHas('eleve', function($q) use ($request) {
                $q->where('classe_id', $request->classe_id);
            });
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $presences = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $presences
        ]);
    }

    /**
     * Créer une présence
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'date' => 'required|date',
            'statut' => 'required|in:present,absent,late',
            'justifie' => 'boolean',
            'motif' => 'nullable|string|max:500',
        ]);

        $presence = Presence::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Présence enregistrée avec succès',
            'data' => $presence->load('eleve')
        ], 201);
    }

    /**
     * Créer plusieurs présences en masse
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.eleve_id' => 'required|exists:eleves,id',
            'attendance.*.date' => 'required|date',
            'attendance.*.statut' => 'required|in:present,absent,late',
            'attendance.*.justifie' => 'boolean',
            'attendance.*.motif' => 'nullable|string|max:500',
        ]);

        $presences = [];
        foreach ($validated['attendance'] as $attendanceData) {
            $presences[] = Presence::create($attendanceData);
        }

        return response()->json([
            'success' => true,
            'message' => count($presences) . ' présence(s) enregistrée(s) avec succès',
            'data' => $presences
        ], 201);
    }

    /**
     * Scanner QR Code
     */
    public function qrScan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_code' => 'required|string',
            'date' => 'required|date',
            'classe_id' => 'required|exists:classes,id',
        ]);

        // TODO: Décoder le QR code pour obtenir l'ID de l'élève
        // Pour l'instant, on suppose que le QR code contient directement l'ID
        $eleveId = $validated['qr_code'];

        $presence = Presence::create([
            'eleve_id' => $eleveId,
            'date' => $validated['date'],
            'statut' => 'present',
            'justifie' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Présence enregistrée via QR code',
            'data' => $presence->load('eleve')
        ], 201);
    }

    /**
     * Obtenir les alertes d'absences successives
     */
    public function getAlerts(Request $request): JsonResponse
    {
        $minConsecutive = $request->get('min_consecutive', 3); // Par défaut 3 absences consécutives
        
        // Récupérer tous les élèves avec leurs absences
        $eleves = \App\Models\Eleve::with(['presences' => function($query) {
            $query->where('statut', 'absent')
                  ->orderBy('date', 'desc');
        }])->get();
        
        $alerts = [];
        
        foreach ($eleves as $eleve) {
            $absences = $eleve->presences;
            if ($absences->count() < $minConsecutive) continue;
            
            // Vérifier si les absences sont consécutives
            $consecutiveCount = 1;
            $lastDate = null;
            
            foreach ($absences as $absence) {
                if ($lastDate === null) {
                    $lastDate = $absence->date;
                    continue;
                }
                
                $daysDiff = $lastDate->diffInDays($absence->date);
                if ($daysDiff === 1) {
                    $consecutiveCount++;
                } else {
                    $consecutiveCount = 1;
                }
                
                $lastDate = $absence->date;
                
                if ($consecutiveCount >= $minConsecutive) {
                    // Récupérer les informations du parent
                    $parent = $eleve->user->parentTuteur ?? null;
                    
                    $alerts[] = [
                        'id' => $eleve->id,
                        'eleve' => [
                            'nom' => $eleve->nom,
                            'prenom' => $eleve->prenom,
                            'classe' => $eleve->classe->nom ?? 'N/A',
                        ],
                        'absences_consecutives' => $consecutiveCount,
                        'derniere_absence' => $absence->date->format('Y-m-d'),
                        'parent_email' => $parent->email ?? null,
                        'parent_phone' => $parent->telephone ?? null,
                    ];
                    break; // Une seule alerte par élève
                }
            }
        }
        
        return response()->json([
            'success' => true,
            'data' => $alerts
        ]);
    }

    /**
     * Mettre à jour une présence
     */
    public function update(Request $request, $id): JsonResponse
    {
        $presence = Presence::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'sometimes|required|in:present,absent,late',
            'justifie' => 'boolean',
            'motif' => 'nullable|string|max:500',
        ]);

        $presence->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Présence mise à jour avec succès',
            'data' => $presence->load('eleve')
        ]);
    }

    /**
     * Supprimer une présence
     */
    public function destroy($id): JsonResponse
    {
        $presence = Presence::findOrFail($id);
        $presence->delete();

        return response()->json([
            'success' => true,
            'message' => 'Présence supprimée avec succès'
        ]);
    }
}

