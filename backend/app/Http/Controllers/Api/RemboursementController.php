<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Remboursement;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RemboursementController extends Controller
{
    /*
      ✅ Liste des remboursements
     */
    public function index(Request $request)
    {
        try {
            // Créer la requête de base
            $query = Remboursement::with('etudiant')
                ->orderBy('created_at', 'desc');

            // ✅ FILTRE : Par statut
            if ($request->has('statut') && $request->statut !== 'tous') {
                $query->where('statut', $request->statut);
            }

            // ✅ FILTRE : Par recherche
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('numero_dossier', 'LIKE', "%{$search}%")
                      ->orWhereHas('etudiant', function($q) use ($search) {
                          $q->where('nom', 'LIKE', "%{$search}%")
                            ->orWhere('prenom', 'LIKE', "%{$search}%")
                            ->orWhere('matricule', 'LIKE', "%{$search}%");
                      });
                });
            }

            // ✅ PAGINATION
            $perPage = $request->get('per_page', 20);
            $remboursements = $query->paginate($perPage);

            // ✅ FORMATER LA RÉPONSE
            $data = $remboursements->getCollection()->map(function ($remboursement) {
                return [
                    'id' => $remboursement->id,
                    'numero_dossier' => $remboursement->numero_dossier,
                    'etudiant' => $remboursement->etudiant ? [
                        'id' => $remboursement->etudiant->id,
                        'nom_complet' => $remboursement->etudiant->nom_complet,
                        'matricule' => $remboursement->etudiant->matricule,
                        'classe' => $remboursement->etudiant->classe
                    ] : null,
                    'montant' => (float) $remboursement->montant,
                    'motif' => $remboursement->motif,
                    'motif_libelle' => $remboursement->motif_libelle,
                    'description' => $remboursement->description,
                    'statut' => $remboursement->statut,
                    'statut_libelle' => $remboursement->statut_libelle,
                    'date_demande' => $remboursement->date_demande->format('d/m/Y H:i'),
                    'created_at' => $remboursement->created_at->format('d/m/Y H:i')
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Remboursements récupérés avec succès',
                'data' => $data,
                'pagination' => [
                    'total' => $remboursements->total(),
                    'per_page' => $remboursements->perPage(),
                    'current_page' => $remboursements->currentPage(),
                    'last_page' => $remboursements->lastPage()
                ],
                'statistiques' => $this->getStatistiques()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Créer un nouveau remboursement
     */
    public function store(Request $request)
    {
        // ✅ VALIDATION
        
        $validator = Validator::make($request->all(), [
            'etudiant_id' => 'required|exists:etudiants,id',
            'montant' => 'required|numeric|min:1000|max:1000000',
            'motif' => 'required|in:double_paiement,erreur_montant,desistement,autre',
            'description' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // ✅ GÉNÉRER LE NUMÉRO DE DOSSIER
            $date = now();
            $count = Remboursement::whereDate('created_at', $date)->count() + 1;
            $numeroDossier = 'RMB-' . $date->format('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            // ✅ CRÉER LE REMBOURSEMENT
            $remboursement = Remboursement::create([
                'numero_dossier' => $numeroDossier,
                'etudiant_id' => $request->etudiant_id,
                'montant' => $request->montant,
                'motif' => $request->motif,
                'description' => $request->description,
                'statut' => 'en_attente',
                'date_demande' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Remboursement créé avec succès',
                'data' => $remboursement->load('etudiant')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Afficher un remboursement
     */
    public function show($id)
    {
        try {
            $remboursement = Remboursement::with('etudiant')->find($id);

            if (!$remboursement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Remboursement non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $remboursement
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Mettre à jour le statut
     */
    public function updateStatut(Request $request, $id)
    {
        // ✅ VALIDATION
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,approuve,refuse,paye',
            'commentaire' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $remboursement = Remboursement::find($id);

            if (!$remboursement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Remboursement non trouvé'
                ], 404);
            }

            $ancienStatut = $remboursement->statut;
            $remboursement->update([
                'statut' => $request->statut
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => [
                    'ancien_statut' => $ancienStatut,
                    'nouveau_statut' => $request->statut,
                    'remboursement' => $remboursement->load('etudiant')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Supprimer un remboursement
     */
    public function destroy($id)
    {
        try {
            $remboursement = Remboursement::find($id);

            if (!$remboursement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Remboursement non trouvé'
                ], 404);
            }

            // Vérifier si on peut supprimer
            if ($remboursement->statut === 'paye') {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un remboursement déjà payé'
                ], 400);
            }

            $remboursement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Remboursement supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Statistiques
     */
    private function getStatistiques()
    {
        $total = Remboursement::count();
        $enAttente = Remboursement::where('statut', 'en_attente')->count();
        $approuves = Remboursement::where('statut', 'approuve')->count();
        $refuses = Remboursement::where('statut', 'refuse')->count();
        $payes = Remboursement::where('statut', 'paye')->count();
        
        $montantTotal = Remboursement::sum('montant');
        $montantAttente = Remboursement::where('statut', 'en_attente')->sum('montant');
        $montantApprouve = Remboursement::where('statut', 'approuve')->sum('montant');
        $montantPaye = Remboursement::where('statut', 'paye')->sum('montant');

        return [
            'total' => $total,
            'en_attente' => $enAttente,
            'approuves' => $approuves,
            'refuses' => $refuses,
            'payes' => $payes,
            'montant_total' => (float) $montantTotal,
            'montant_en_attente' => (float) $montantAttente,
            'montant_approuve' => (float) $montantApprouve,
            'montant_paye' => (float) $montantPaye
        ];
    }

    /**
     * ✅ Route de test API
     */
    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'API Laravel fonctionne correctement!',
            'version' => '1.0.0',
            'timestamp' => now()->format('Y-m-d H:i:s')
        ]);
    }
}