<?php

namespace App\Http\Controllers;

use App\Models\NiveauScolaire;
use App\Models\Cycle;
use App\Models\Series;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AcademicStructureController extends Controller
{
    /**
     * ========== NIVEAUX SCOLAIRES ==========
     */

    public function indexNiveaux()
    {
        $niveaux = NiveauScolaire::with('classes')->get();
        return response()->json(['niveaux' => $niveaux]);
    }

    public function storeNiveau(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|unique:niveaux_scolaires,nom',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $niveau = NiveauScolaire::create($request->all());

        return response()->json([
            'message' => 'Niveau scolaire créé avec succès',
            'niveau' => $niveau
        ], 201);
    }

    public function updateNiveau(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $niveau = NiveauScolaire::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|unique:niveaux_scolaires,nom,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $niveau->update($request->all());

        return response()->json([
            'message' => 'Niveau scolaire mis à jour avec succès',
            'niveau' => $niveau
        ]);
    }

    public function destroyNiveau($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $niveau = NiveauScolaire::findOrFail($id);

        // Vérifier s'il y a des classes associées
        if ($niveau->classes()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer un niveau scolaire ayant des classes associées'
            ], 400);
        }

        $niveau->delete();

        return response()->json(['message' => 'Niveau scolaire supprimé avec succès']);
    }

    /**
     * ========== CYCLES ==========
     */

    public function indexCycles()
    {
        $cycles = Cycle::with('niveauScolaire')->get();
        return response()->json(['cycles' => $cycles]);
    }

    public function storeCycle(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'niveau_id' => 'required|exists:niveaux_scolaires,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cycle = Cycle::create($request->all());

        return response()->json([
            'message' => 'Cycle créé avec succès',
            'cycle' => $cycle->load('niveauScolaire')
        ], 201);
    }

    public function updateCycle(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $cycle = Cycle::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'niveau_id' => 'required|exists:niveaux_scolaires,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cycle->update($request->all());

        return response()->json([
            'message' => 'Cycle mis à jour avec succès',
            'cycle' => $cycle->load('niveauScolaire')
        ]);
    }

    public function destroyCycle($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $cycle = Cycle::findOrFail($id);
        $cycle->delete();

        return response()->json(['message' => 'Cycle supprimé avec succès']);
    }

    /**
     * ========== SÉRIES ==========
     */

    public function indexSeries()
    {
        $series = Series::all();
        return response()->json(['series' => $series]);
    }

    public function storeSerie(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'code' => 'nullable|string|unique:series,code',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $serie = Series::create($request->all());

        return response()->json([
            'message' => 'Série créée avec succès',
            'serie' => $serie
        ], 201);
    }

    public function updateSerie(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $serie = Series::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'code' => 'nullable|string|unique:series,code,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $serie->update($request->all());

        return response()->json([
            'message' => 'Série mise à jour avec succès',
            'serie' => $serie
        ]);
    }

    public function destroySerie($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $serie = Series::findOrFail($id);
        $serie->delete();

        return response()->json(['message' => 'Série supprimée avec succès']);
    }

    /**
     * ========== ANNÉES SCOLAIRES ==========
     */

    public function indexAnneeScolaires()
    {
        $annees = AnneeScolaire::orderBy('annee', 'desc')->get();
        return response()->json(['annees_scolaires' => $annees]);
    }

    public function storeAnneeScolaire(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'annee' => 'required|string|unique:annee_scolaires,annee',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'est_actif' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Si cette année est marquée comme active, désactiver les autres
        if ($request->est_actif) {
            DB::table('annee_scolaires')->update(['est_actif' => false]);
        }

        $annee = AnneeScolaire::create($request->all());

        return response()->json([
            'message' => 'Année scolaire créée avec succès',
            'annee_scolaire' => $annee
        ], 201);
    }

    public function updateAnneeScolaire(Request $request, $id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $annee = AnneeScolaire::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'annee' => 'required|string|unique:annee_scolaires,annee,' . $id,
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'est_actif' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Si cette année est marquée comme active, désactiver les autres
        if ($request->est_actif) {
            DB::table('annee_scolaires')
                ->where('id', '!=', $id)
                ->update(['est_actif' => false]);
        }

        $annee->update($request->all());

        return response()->json([
            'message' => 'Année scolaire mise à jour avec succès',
            'annee_scolaire' => $annee
        ]);
    }

    public function destroyAnneeScolaire($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $annee = AnneeScolaire::findOrFail($id);

        // Vérifier s'il y a des inscriptions associées
        if ($annee->inscriptions()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer une année scolaire ayant des inscriptions associées'
            ], 400);
        }

        $annee->delete();

        return response()->json(['message' => 'Année scolaire supprimée avec succès']);
    }

    /**
     * Obtenir l'année scolaire active
     */
    public function getActiveAnneeScolaire()
    {
        $annee = AnneeScolaire::where('est_actif', true)->first();
        
        if (!$annee) {
            // Si aucune année active, retourner la plus récente
            $annee = AnneeScolaire::orderBy('annee', 'desc')->first();
        }

        return response()->json(['annee_scolaire' => $annee]);
    }
}

