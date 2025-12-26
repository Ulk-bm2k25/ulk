<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Inscription;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    // 📄 FICHE D’INSCRIPTION
    public function ficheInscription($inscriptionId)
    {
        $inscription = Inscription::with([
            'eleve.user',
            'eleve.classe',
            'eleve.tuteurs'
        ])->findOrFail($inscriptionId);

        $pdf = Pdf::loadView(
            'pdf.fiche_inscription',
            compact('inscription')
        );

        return $pdf->download(
            'fiche_inscription_'.$inscription->id.'.pdf'
        );
    }

    // 🪪 CARTE DE SCOLARITÉ
    public function carteScolarite($eleveId)
    {
        $eleve = Eleve::with([
            'user',
            'classe',
            'carteScolarite'
        ])->findOrFail($eleveId);

        $pdf = Pdf::loadView(
            'pdf.carte_scolarite',
            compact('eleve')
        );

        return $pdf->download(
            'carte_scolarite_'.$eleve->id.'.pdf'
        );
    }
}