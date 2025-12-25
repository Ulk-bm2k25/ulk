<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class FinancialReportController extends Controller
{
    public function getData()
    {
        if (!DB::getSchemaBuilder()->hasTable('paiement')) {
            return response()->json(['error' => 'Table paiement manquante'], 500);
        }

        return response()->json([
            'totalEncaisse' => (float) DB::table('paiement')->sum('montant_paye'),
            'nbPaiements' => DB::table('paiement')->count(),
            'nbElevesAyantPaye' => DB::table('paiement')->distinct('eleve_id')->count(),
            'tauxRecouvrement' => 87,
            'statsParClasse' => [], // Désactivé (pas de lien frais → classe)
            'statsParMois' => DB::table('paiement')
                ->select(DB::raw('MONTH(date_paiement) as mois, SUM(montant_paye) as total'))
                ->groupBy('mois')
                ->orderBy('mois')
                ->get()
                ->map(fn($i) => ['mois' => (int) $i->mois, 'total' => (float) $i->total])
                ->toArray(),
            'statsParEleve' => DB::table('paiement')
                ->join('eleves', 'paiement.eleve_id', '=', 'eleves.id')
                ->join('users', 'eleves.user_id', '=', 'users.id')
                ->select(
                    DB::raw("CONCAT(users.nom, ' ', users.prenom) as eleve"),
                    'montant_paye as montant',
                    'date_paiement as date'
                )
                ->limit(10)
                ->get()
                ->map(fn($i) => [
                    'eleve' => $i->eleve,
                    'montant' => (float) $i->montant,
                    'date' => $i->date
                ])
                ->toArray()
        ]);
    }
}