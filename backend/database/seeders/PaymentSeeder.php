<?php

namespace Database\Seeders;

use App\Models\FraisType;
use App\Models\TranchePaiement;
use App\Models\Paiement;
use App\Models\Eleve;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $frais = FraisType::create([
            'nom' => 'Scolarité Annuelle',
            'montant_total' => 250000,
            'description' => 'Frais de scolarité pour l\'année académique'
        ]);

        $t1 = TranchePaiement::create([
            'frais_type_id' => $frais->id,
            'nom_tranche' => 'Tranche 1 (Inscription)',
            'pourcentage_du_total' => 40.00,
            'date_limite' => '2025-09-30'
        ]);

        $t2 = TranchePaiement::create([
            'frais_type_id' => $frais->id,
            'nom_tranche' => 'Tranche 2',
            'pourcentage_du_total' => 30.00,
            'date_limite' => '2025-12-31'
        ]);

        $t3 = TranchePaiement::create([
            'frais_type_id' => $frais->id,
            'nom_tranche' => 'Tranche 3',
            'pourcentage_du_total' => 30.00,
            'date_limite' => '2026-03-31'
        ]);

        // Seed some payments for the mock student
        $student = Eleve::first();
        if ($student) {
            Paiement::create([
                'eleve_id' => $student->id,
                'tranche_id' => $t1->id,
                'montant_paye' => 100000,
                'mode_paiement' => 'Mobile Money (Orange)',
                'reference_paiement' => 'TXN-' . strtoupper(uniqid()),
                'statut' => 'payé',
                'date_paiement' => '2025-09-05'
            ]);
        }
    }
}
