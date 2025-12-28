<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\CarteScolarite;
use App\Models\AnneeScolaire;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    // 📄 FICHE D'INSCRIPTION
    public function ficheInscription($inscriptionId)
    {
        $inscription = Inscription::with([
            'eleve.user',
            'eleve.classe.niveauScolaire',
            'eleve.tuteurs.user',
            'eleve.documents',
            'anneeScolaire'
        ])->findOrFail($inscriptionId);

        $pdf = Pdf::loadView(
            'pdf.fiche_inscription',
            compact('inscription')
        )->setPaper('a4', 'portrait');

        return $pdf->download(
            'fiche_inscription_'.$inscription->eleve->matricule.'.pdf'
        );
    }

    // 🪪 CARTE DE SCOLARITÉ
    public function carteScolarite($eleveId)
    {
        $eleve = Eleve::with([
            'user',
            'classe.niveauScolaire',
        ])->findOrFail($eleveId);

        // Obtenir ou créer la carte de scolarité
        $anneeScolaire = AnneeScolaire::where('est_actif', true)->first();
        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::orderBy('annee', 'desc')->first();
        }

        $carte = CarteScolarite::firstOrCreate(
            [
                'eleve_id' => $eleve->id,
                'annee_scolaire' => $anneeScolaire ? $anneeScolaire->annee : date('Y') . '-' . (date('Y') + 1),
            ],
            [
                'code_barre' => $eleve->matricule,
                'date_generation' => now(),
                'statut' => 'active',
            ]
        );

        // Générer le QR code (utiliser une API externe ou une bibliothèque)
        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($eleve->matricule);

        $pdf = Pdf::loadView(
            'pdf.carte_scolarite',
            compact('eleve', 'carte', 'anneeScolaire', 'qrCodeUrl')
        )->setPaper([0, 0, 226.77, 141.73], 'landscape'); // Format carte (85.6mm x 53.98mm)

        return $pdf->download(
            'carte_scolarite_'.$eleve->matricule.'.pdf'
        );
    }

    /**
     * Prévisualiser la fiche d'inscription
     */
    public function previewFicheInscription($inscriptionId)
    {
        $inscription = Inscription::with([
            'eleve.user',
            'eleve.classe.niveauScolaire',
            'eleve.tuteurs.user',
            'eleve.documents',
            'anneeScolaire'
        ])->findOrFail($inscriptionId);

        return view('pdf.fiche_inscription', compact('inscription'));
    }

    /**
     * Prévisualiser la carte de scolarité
     */
    public function previewCarteScolarite($eleveId)
    {
        $eleve = Eleve::with([
            'user',
            'classe.niveauScolaire',
        ])->findOrFail($eleveId);

        $anneeScolaire = AnneeScolaire::where('est_actif', true)->first();
        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::orderBy('annee', 'desc')->first();
        }

        $carte = CarteScolarite::where('eleve_id', $eleve->id)
            ->where('annee_scolaire', $anneeScolaire ? $anneeScolaire->annee : date('Y') . '-' . (date('Y') + 1))
            ->first();

        if (!$carte) {
            $carte = new CarteScolarite([
                'eleve_id' => $eleve->id,
                'annee_scolaire' => $anneeScolaire ? $anneeScolaire->annee : date('Y') . '-' . (date('Y') + 1),
                'code_barre' => $eleve->matricule,
                'date_generation' => now(),
                'statut' => 'active',
            ]);
        }

        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($eleve->matricule);

        return view('pdf.carte_scolarite', compact('eleve', 'carte', 'anneeScolaire', 'qrCodeUrl'));
    }
}