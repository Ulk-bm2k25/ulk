<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParentTuteur;
use App\Models\Eleve;
use App\Models\Inscription;
use Illuminate\Support\Facades\Auth;

class ParentPortalController extends Controller
{
    /**
     * Get the dashboard summary for the parent.
     */
    public function getDashboardSummary(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'PARENT') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $parent = ParentTuteur::where('user_id', $user->id)->first();
        if (!$parent) {
            return response()->json(['message' => 'Profil parent non trouvé'], 404);
        }

        $childrenCount = $parent->eleves()->count();
        
        // Simuler des notifications pour l'instant
        $notificationsCount = 0; 

        return response()->json([
            'parent' => $parent,
            'stats' => [
                'children_count' => $childrenCount,
                'notifications_count' => $notificationsCount,
                'payments_due' => '0 FCFA'
            ]
        ]);
    }

    /**
     * Get the list of children for the authenticated parent.
     */
    public function getChildren(Request $request)
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();
        
        if (!$parent) {
            return response()->json([], 200);
        }

        $children = $parent->eleves()->with(['classe.niveauScolaire'])->get();

        return response()->json($children);
    }

    /**
     * Get specific child details including registrations and grades.
     */
    public function getChildDetails($eleveId)
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();

        // Vérifier que c'est bien l'enfant du parent
        $isChild = $parent->eleves()->where('eleves.id', $eleveId)->exists();
        if (!$isChild) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $eleve = Eleve::with(['user', 'classe', 'inscriptions.anneeScolaire'])->findOrFail($eleveId);
        
        return response()->json($eleve);
    }
}
