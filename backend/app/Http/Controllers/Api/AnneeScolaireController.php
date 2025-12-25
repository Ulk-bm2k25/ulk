<?php

namespace App\Http\Controllers;

use App\Models\AnneeScolaire;
use Illuminate\Http\Request;

class AnneeScolaireController extends Controller
{
    /**
     * Afficher la liste des années scolaires
     */
    public function index()
    {
        $annees = AnneeScolaire::orderBy('annee', 'desc')->get();
        return view('annee_scolaires.index', compact('annees'));
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        return view('annee_scolaires.create');
    }

    /**
     * Enregistrer une nouvelle année scolaire
     */
    public function store(Request $request)
    {
        $request->validate([
            'annee' => 'required|string|max:20|unique:annee_scolaires,annee',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ]);

        AnneeScolaire::create([
            'annee' => $request->annee,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        return redirect()
            ->route('annee-scolaires.index')
            ->with('success', 'Année scolaire ajoutée avec succès');
    }

    /**
     * Afficher une année scolaire
     */
    public function show(AnneeScolaire $anneeScolaire)
    {
        return view('annee_scolaires.show', compact('anneeScolaire'));
    }

    /**
     * Afficher le formulaire d’édition
     */
    public function edit(AnneeScolaire $anneeScolaire)
    {
        return view('annee_scolaires.edit', compact('anneeScolaire'));
    }

    /**
     * Mettre à jour une année scolaire
     */
    public function update(Request $request, AnneeScolaire $anneeScolaire)
    {
        $request->validate([
            'annee' => 'required|string|max:20|unique:annee_scolaires,annee,' . $anneeScolaire->id,
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ]);

        $anneeScolaire->update([
            'annee' => $request->annee,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        return redirect()
            ->route('annee-scolaires.index')
            ->with('success', 'Année scolaire modifiée avec succès');
    }

    /**
     * Supprimer une année scolaire
     */
    public function destroy(AnneeScolaire $anneeScolaire)
    {
        $anneeScolaire->delete();

        return redirect()
            ->route('annee-scolaires.index')
            ->with('success', 'Année scolaire supprimée avec succès');
    }
}
