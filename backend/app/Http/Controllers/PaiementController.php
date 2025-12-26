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
        $eleve = Eleve::with('user')->findOrFail($eleveId);
        
        // Assuming there's only one main fee type for now
        $fraisType = FraisType::first();
        $totalOwed = $fraisType ? $fraisType->montant_total : 0;
        
        $payments = Paiement::where('eleve_id', $eleveId)
            ->with('tranche')
            ->orderBy('date_paiement', 'desc')
            ->get();
            
        $totalPaid = $payments->where('statut', 'payé')->sum('montant_paye');
        $balance = $totalOwed - $totalPaid;

        return response()->json([
            'summary' => [
                'totalOwed' => $totalOwed,
                'totalPaid' => $totalPaid,
                'balance' => $balance,
                'currency' => 'FCFA'
            ],
            'transactions' => $payments->map(function($p) use ($eleve) {
                return [
                    'id' => $p->reference_paiement ?? ('#PAY-' . $p->id),
                    'student' => $eleve->user->nom . ' ' . $eleve->user->prenom,
                    'date' => $p->date_paiement,
                    'method' => $p->mode_paiement,
                    'amount' => number_format($p->montant_paye, 0, ',', ' ') . ' FCFA',
                    'status' => $p->statut
                ];
            })
        ]);
    }

    /**
     * Process a new payment (Simulated Mobile Money).
     */
    public function processPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:eleves,id',
            'amount' => 'required|numeric|min:1',
            'provider' => 'required|string',
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Logic to find current tranche (first unpaid or partially paid)
        $tranche = TranchePaiement::first(); // Simplification: apply to first tranche if none found

        $payment = Paiement::create([
            'eleve_id' => $request->eleve_id,
            'tranche_id' => $tranche->id,
            'montant_paye' => $request->amount,
            'mode_paiement' => 'Mobile Money (' . ucfirst($request->provider) . ')',
            'reference_paiement' => 'TXN-' . strtoupper(uniqid()),
            'statut' => 'payé', // Automatically valid for simulation
            'date_paiement' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Paiement effectué avec succès',
            'payment' => $payment
        ]);
    }

    /**
     * Get all payments (Admin Portal).
     */
    public function getAdminPayments()
    {
        $payments = Paiement::with(['eleve.user', 'tranche'])
            ->orderBy('date_paiement', 'desc')
            ->get();
            
        return response()->json($payments);
    }
}
