<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Eleve;
use App\Models\FraisType;
use App\Models\TranchePaiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    /**
     * Get payment summary and history for a child (Parent Portal).
     */
    public function getStudentPayments($eleveId)
    {
        $eleve = Eleve::with(['user', 'classe.niveauScolaire'])->findOrFail($eleveId);
        
        // Use the fee associated with the student's level or fallback
        $fraisType = FraisType::where('niveau_scolaire_id', $eleve->classe->niveau_scolaire_id)->first() 
                    ?? FraisType::first();
                    
        $totalOwed = $fraisType ? $fraisType->montant_total : 0;
        
        $payments = Paiement::where('eleve_id', $eleveId)
            ->with('tranche')
            ->orderBy('date_paiement', 'desc')
            ->get();
            
        $totalPaid = $payments->where('statut', 'payé')->sum('montant_paye');
        $balance = $totalOwed - $totalPaid;

        return response()->json([
            'summary' => [
                'student_name' => $eleve->user->nom . ' ' . $eleve->user->prenom,
                'class' => $eleve->classe->nom,
                'totalOwed' => $totalOwed,
                'totalPaid' => $totalPaid,
                'balance' => $balance,
                'currency' => 'FCFA',
                'status' => $balance <= 0 ? 'soldé' : ($totalPaid > 0 ? 'partiel' : 'impayé')
            ],
            'transactions' => $payments->map(function($p) {
                return [
                    'id' => $p->reference_paiement ?? ('#PAY-' . $p->id),
                    'date' => $p->date_paiement,
                    'method' => $p->mode_paiement,
                    'amount' => number_format($p->montant_paye, 0, ',', ' ') . ' FCFA',
                    'status' => $p->statut,
                    'tranche' => $p->tranche?->nom ?? 'N/A'
                ];
            })
        ]);
    }

    /**
     * Get financial statistics for the admin dashboard.
     */
    public function getAdminFinanceStats()
    {
        $totalRevenue = Paiement::where('statut', 'payé')->sum('montant_paye');
        $recentPayments = Paiement::with('eleve.user')
            ->where('statut', 'payé')
            ->orderBy('date_paiement', 'desc')
            ->limit(10)
            ->get();

        $totalExpected = DB::table('eleves')
            ->join('classes', 'eleves.classe_id', '=', 'classes.id')
            ->join('frais_types', 'classes.niveau_scolaire_id', '=', 'frais_types.niveau_scolaire_id')
            ->sum('frais_types.montant_total');

        $recoveryRate = $totalExpected > 0 ? ($totalRevenue / $totalExpected) * 100 : 0;

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_expected' => $totalExpected,
                'recovery_rate' => round($recoveryRate, 1),
                'balance_to_collect' => $totalExpected - $totalRevenue,
            ],
            'recent_transactions' => $recentPayments->map(function($p) {
                return [
                    'id' => $p->id,
                    'student' => $p->eleve->user->nom . ' ' . $p->eleve->user->prenom,
                    'amount' => $p->montant_paye,
                    'date' => $p->date_paiement,
                    'method' => $p->mode_paiement
                ];
            })
        ]);
    }

    /**
     * Get all payments (Admin Portal).
     */
    public function getAdminPayments()
    {
        $payments = Paiement::with(['eleve.user', 'eleve.classe', 'tranche'])
            ->orderBy('date_paiement', 'desc')
            ->get();
            
        return response()->json($payments);
    }
    /**
     * Process a payment (Simulated Success).
     */
    public function processPayment(Request $request)
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'amount' => 'required|numeric|min:1',
            'provider' => 'required|string',
            'phone' => 'required|string',
        ]);

        $tranche = TranchePaiement::first(); 

        $payment = Paiement::create([
            'eleve_id' => $request->eleve_id,
            'tranche_id' => $tranche ? $tranche->id : 1,
            'montant_paye' => $request->amount,
            'mode_paiement' => 'Mobile Money (' . $request->provider . ')',
            'reference_paiement' => 'PAY-' . strtoupper(uniqid()),
            'statut' => 'payé',
            'date_paiement' => now(),
        ]);

        return response()->json([
            'message' => 'Paiement effectué avec succès (Simulé)',
            'payment' => $payment
        ], 200);
    }
}
