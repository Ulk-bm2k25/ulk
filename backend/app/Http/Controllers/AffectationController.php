<?php

namespace App\Http\Controllers;

use App\Models\AffectationClasse;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AffectationController extends Controller
{
    /**
     * Lister toutes les affectations
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $query = AffectationClasse::with(['eleve.user', 'classe.niveauScolaire']);

        // Filtres
        if ($request->has('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $affectations = $query->orderBy('date_affectation', 'desc')->get();

        return response()->json(['affectations' => $affectations]);
    }

    /**
     * Affecter un élève à une classe
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:eleves,id',
            'classe_id' => 'required|exists:classes,id',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $user) {
            $eleve = Eleve::findOrFail($request->eleve_id);
            $classe = Classe::findOrFail($request->classe_id);

            // Vérifier que l'élève est inscrit pour l'année scolaire de la classe
            $anneeScolaire = AnneeScolaire::where('annee', $classe->annee_scolaire)
                ->orWhere('est_actif', true)
                ->first();

            if (!$anneeScolaire) {
                return response()->json([
                    'message' => 'Aucune année scolaire trouvée pour cette classe'
                ], 400);
            }

            $inscription = Inscription::where('eleve_id', $eleve->id)
                ->where('annee_scolaire_id', $anneeScolaire->id)
                ->where('statut', 'inscrit')
                ->first();

            if (!$inscription) {
                return response()->json([
                    'message' => 'L\'élève doit être inscrit pour l\'année scolaire de la classe'
                ], 400);
            }

            // Vérifier la capacité de la classe
            if ($classe->isFull()) {
                return response()->json([
                    'message' => 'La classe est pleine. Capacité maximale: ' . $classe->capacity_max
                ], 400);
            }

            // Vérifier si l'élève n'est pas déjà affecté à cette classe
            $existingAffectation = AffectationClasse::where('eleve_id', $eleve->id)
                ->where('classe_id', $classe->id)
                ->where('statut', 'affecte')
                ->first();

            if ($existingAffectation) {
                return response()->json([
                    'message' => 'L\'élève est déjà affecté à cette classe'
                ], 400);
            }

            // Désaffecter l'élève de son ancienne classe s'il en a une
            if ($eleve->classe_id) {
                $oldAffectation = AffectationClasse::where('eleve_id', $eleve->id)
                    ->where('classe_id', $eleve->classe_id)
                    ->where('statut', 'affecte')
                    ->first();

                if ($oldAffectation) {
                    $oldAffectation->update(['statut' => 'desaffecte']);
                    $oldClasse = Classe::find($eleve->classe_id);
                    if ($oldClasse) {
                        $oldClasse->decrementStudents();
                    }
                }
            }

            // Créer la nouvelle affectation
            $affectation = AffectationClasse::create([
                'eleve_id' => $eleve->id,
                'classe_id' => $classe->id,
                'date_affectation' => now(),
                'statut' => 'affecte',
                'commentaire' => $request->commentaire,
            ]);

            // Mettre à jour la classe de l'élève
            $eleve->update(['classe_id' => $classe->id]);

            // Incrémenter le nombre d'élèves dans la classe
            $classe->incrementStudents();

            // Log activity
            DB::table('logs_activite')->insert([
                'user_id' => $user->id,
                'action' => "Affectation de l'élève {$eleve->id} à la classe {$classe->id}",
                'created_at' => now(),
                'updated_at' => now(),
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Élève affecté à la classe avec succès',
                'affectation' => $affectation->load(['eleve.user', 'classe.niveauScolaire'])
            ], 201);
        });
    }

    /**
     * Transférer un élève d'une classe à une autre
     */
    public function transfer(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nouvelle_classe_id' => 'required|exists:classes,id',
            'commentaire' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $id, $user) {
            $affectation = AffectationClasse::findOrFail($id);
            $eleve = $affectation->eleve;
            $ancienneClasse = $affectation->classe;
            $nouvelleClasse = Classe::findOrFail($request->nouvelle_classe_id);

            // Vérifier la capacité de la nouvelle classe
            if ($nouvelleClasse->isFull()) {
                return response()->json([
                    'message' => 'La classe de destination est pleine'
                ], 400);
            }

            // Marquer l'ancienne affectation comme transférée
            $affectation->update([
                'statut' => 'transfere',
                'commentaire' => $request->commentaire ?? 'Transfert vers classe ' . $nouvelleClasse->nom,
            ]);

            // Décrémenter l'ancienne classe
            $ancienneClasse->decrementStudents();

            // Créer la nouvelle affectation
            $nouvelleAffectation = AffectationClasse::create([
                'eleve_id' => $eleve->id,
                'classe_id' => $nouvelleClasse->id,
                'date_affectation' => now(),
                'statut' => 'affecte',
                'commentaire' => $request->commentaire ?? 'Transfert depuis classe ' . $ancienneClasse->nom,
            ]);

            // Mettre à jour la classe de l'élève
            $eleve->update(['classe_id' => $nouvelleClasse->id]);

            // Incrémenter la nouvelle classe
            $nouvelleClasse->incrementStudents();

            // Log activity
            DB::table('logs_activite')->insert([
                'user_id' => $user->id,
                'action' => "Transfert de l'élève {$eleve->id} de la classe {$ancienneClasse->id} vers {$nouvelleClasse->id}",
                'created_at' => now(),
                'updated_at' => now(),
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Élève transféré avec succès',
                'affectation' => $nouvelleAffectation->load(['eleve.user', 'classe.niveauScolaire'])
            ]);
        });
    }

    /**
     * Désaffecter un élève d'une classe
     */
    public function unassign($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return DB::transaction(function () use ($id, $user) {
            $affectation = AffectationClasse::findOrFail($id);
            $eleve = $affectation->eleve;
            $classe = $affectation->classe;

            // Marquer l'affectation comme désaffectée
            $affectation->update(['statut' => 'desaffecte']);

            // Retirer la classe de l'élève
            $eleve->update(['classe_id' => null]);

            // Décrémenter le nombre d'élèves dans la classe
            $classe->decrementStudents();

            // Log activity
            DB::table('logs_activite')->insert([
                'user_id' => $user->id,
                'action' => "Désaffectation de l'élève {$eleve->id} de la classe {$classe->id}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Élève désaffecté avec succès'
            ]);
        });
    }

    /**
     * Obtenir les affectations d'un élève
     */
    public function getByEleve($eleveId)
    {
        $affectations = AffectationClasse::where('eleve_id', $eleveId)
            ->with(['classe.niveauScolaire'])
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json(['affectations' => $affectations]);
    }

    /**
     * Obtenir les affectations d'une classe
     */
    public function getByClasse($classeId)
    {
        $affectations = AffectationClasse::where('classe_id', $classeId)
            ->where('statut', 'affecte')
            ->with(['eleve.user'])
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json(['affectations' => $affectations]);
    }
}

