<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class InscriptionController extends Controller
{
    /**
     * List all inscriptions for admin.
     */
    public function index()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $inscriptions = Inscription::with([
            'eleve.user',
            'eleve.classe',
            'eleve.tuteurs',
            'anneeScolaire'
        ])->orderBy('created_at', 'desc')->get();

        return response()->json(['inscriptions' => $inscriptions]);
    }

    /**
     * Update inscription status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|string|in:inscrit,rejete,en attente',
        ]);

        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $inscription = Inscription::findOrFail($id);
        
        return DB::transaction(function () use ($request, $inscription, $user) {
            $inscription->update(['statut' => $request->statut]);

            // Create notification for the parent(s)
            $eleve = $inscription->eleve;
            $tuteurs = $eleve->tuteurs;

            foreach ($tuteurs as $tuteur) {
                if ($tuteur->user_id) {
                    DB::table('notifications')->insert([
                        'type' => $request->statut === 'inscrit' ? 'success' : 'alert',
                        'message' => "L'inscription de " . ($eleve->user->prenom ?? '') . " " . ($eleve->user->nom ?? '') . " a été " . ($request->statut === 'inscrit' ? 'validée' : 'rejetée') . ".",
                        'destinataire_id' => $tuteur->user_id,
                        'lu' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Log activity
            DB::table('logs_activite')->insert([
                'user_id' => $user->id,
                'action' => "Mise à jour statut inscription ID $inscription->id vers $request->statut",
                'date_action' => now(),
                'ip_adresse' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Statut mis à jour avec succès',
                'inscription' => $inscription->load(['eleve.user', 'eleve.classe'])
            ]);
        });
    }
}
