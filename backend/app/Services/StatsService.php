<?php

namespace App\Services;

use App\Models\Classe;
use App\Models\Note;
use App\Models\Presence;
use Carbon\Carbon; 
use App\Models\Matiere;
use App\Models\Semestre;

class StatsService
{
    /**
     * Statistiques générales de la classe
     */
    public function getStatsGenerales(int $classeId): array
    {
        $classe = Classe::with('eleves')->findOrFail($classeId);
        $eleves = $classe->eleves;

        $effectifTotal = $eleves->count();
        $nbGarcons = $eleves->where('genre', 'M')->count();
        $nbFilles = $eleves->where('genre', 'F')->count();

        // Calcul âge moyen
        $agesMoyens = $eleves->pluck('date_naissance')->map(function($date) {
        if (!$date) return null; // Ignore les valeurs nulles
        return Carbon::parse($date)->age; // Carbon calcule automatiquement l'âge
        })->filter(); // supprime les valeurs nulles

$ageMoyen = $agesMoyens->avg();
        return [
            'effectif_total' => $effectifTotal,
            'nombre_garcons' => $nbGarcons,
            'nombre_filles' => $nbFilles,
            'age_moyen' => round($ageMoyen, 1),
            'taux_presence_global' => $this->getTauxPresenceClasse($classeId),
        ];
    }

    /* Recuperer l'id du semestre actuel */
    private function getSemestreId(string $periode): int
{
    $mapping = [
        'TRIMESTRE_1' => 'Semestre 1',
        'TRIMESTRE_2' => 'Semestre 2',
        'TRIMESTRE_3' => 'Semestre 3',
    ];

    $nomSemestre = $mapping[$periode] ?? null;

    if (!$nomSemestre) {
        throw new \Exception("Période '$periode' invalide.");
    }

    $semestre = Semestre::where('nom', $nomSemestre)->first();
    if (!$semestre) {
        throw new \Exception("Semestre '$nomSemestre' introuvable.");
    }

    return $semestre->id;
}

    /**
     * Statistiques académiques
     */
    public function getStatsAcademiques(int $classeId, string $periode, string $anneeScolaire): array
{
    $classe = Classe::with('eleves')->findOrFail($classeId);
    $semestreId = $this->getSemestreId($periode);

    $moyennes = [];
    foreach ($classe->eleves as $eleve) {
        $moyenne = $this->getMoyenneEleve($eleve->id, $semestreId);
        if ($moyenne > 0) {
            $moyennes[] = $moyenne;
        }
    }

    $statsMatieres = [];
    $matieres = Matiere::all();
    foreach ($matieres as $matiere) {
        $notesMat = Note::where('matiere_id', $matiere->id)
            ->where('semestre_id', $semestreId)
            ->pluck('valeur'); // <-- juste 'valeur', sans 'annee_scolaire'

        if ($notesMat->isNotEmpty()) {
            $statsMatieres[] = [
                'matiere' => $matiere->nom,
                'moyenne' => round($notesMat->avg(), 2),
                'min' => round($notesMat->min(), 2),
                'max' => round($notesMat->max(), 2),
            ];
        }
    }

    return [
        'moyenne_classe' => count($moyennes) > 0 ? round(array_sum($moyennes) / count($moyennes), 2) : 0,
        'plus_forte_moyenne' => count($moyennes) > 0 ? round(max($moyennes), 2) : 0,
        'plus_faible_moyenne' => count($moyennes) > 0 ? round(min($moyennes), 2) : 0,
        'stats_par_matiere' => $statsMatieres,
    ];
}




    /**
     * Répartition admis/en difficulté
     */
    public function getRepartitionNotes(int $classeId, string $periode, string $anneeScolaire): array
    {
        $classe = Classe::with('eleves')->findOrFail($classeId);
        
        $admis = 0;
        $enDifficulte = 0;

        $semestreId = $this->getSemestreId($periode);
        
        foreach ($classe->eleves as $eleve) {
            $moyenne = $this->getMoyenneEleve($eleve->id, $semestreId, $anneeScolaire);
            if ($moyenne >= 10) {
                $admis++;
            } elseif ($moyenne > 0) {
                $enDifficulte++;
            }
        }

        $total = $classe->eleves->count();

        return [
            'admis' => $admis,
            'en_difficulte' => $enDifficulte,
            'taux_reussite' => $total > 0 ? round(($admis / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Statistiques de progression entre deux périodes
     */
    public function getStatsProgression(int $classeId, string $periodeActuelle, string $periodePrecedente, string $anneeScolaire): array
    {
        $classe = Classe::with('eleves')->findOrFail($classeId);
        
        $enProgression = 0;
        $enRegression = 0;
        $stables = 0;

        $semestreId = $this->getSemestreId($periodeActuelle);
        foreach ($classe->eleves as $eleve) {
            $moyenneActuelle = $this->getMoyenneEleve($eleve->id, $semestreId, $anneeScolaire);
            $semestreIdPrecedente = $this->getSemestreId($periodePrecedente);
            $moyennePrecedente = $this->getMoyenneEleve($eleve->id, $semestreIdPrecedente, $anneeScolaire);

            if ($moyenneActuelle > 0 && $moyennePrecedente > 0) {
                $diff = $moyenneActuelle - $moyennePrecedente;

                if ($diff > 0.5) {
                    $enProgression++;
                } elseif ($diff < -0.5) {
                    $enRegression++;
                } else {
                    $stables++;
                }
            }
        }

        return [
            'en_progression' => $enProgression,
            'en_regression' => $enRegression,
            'stables' => $stables,
        ];
    }

    /**
     * Statistiques de discipline
     */
    public function getStatsDiscipline(int $classeId): array
    {
        $classe = Classe::with('eleves')->findOrFail($classeId);
        $eleveIds = $classe->eleves->pluck('id');

        $presencesDernierMois = Presence::whereIn('eleve_id', $eleveIds)
            ->where('date', '>=', now()->subMonth())
            ->get();

        $absencesNonJustifiees = $presencesDernierMois
        ->where('present', 0) // absent = 0
        ->count();

        // Si tu n'as pas de notion de "retard" dans ta table, mets 0 ou supprime
        $retards = 0;

        return [
            'absences_non_justifiees' => $absencesNonJustifiees,
            'retards' => $retards,
            'taux_absenteisme' => $this->getTauxAbsenteisme($classeId),
        ];
    }

    // ========== HELPERS PRIVÉS ==========

    /**
     * Calcul moyenne d'un élève
     */
    /**
 * Calcul moyenne d'un élève
 */
private function getMoyenneEleve(int $eleveId, int $semestreId): float
{
    $notes = Note::where('eleve_id', $eleveId)
        ->where('semestre_id', $semestreId)
        ->with('matiere')
        ->get();

    if ($notes->isEmpty()) {
        return 0;
    }

    $totalPoints = 0;
    $totalCoefficients = 0;

    foreach ($notes as $note) {
        $totalPoints += $note->valeur * $note->matiere->coefficient;
        $totalCoefficients += $note->matiere->coefficient;
    }

    return $totalCoefficients > 0 ? $totalPoints / $totalCoefficients : 0;
}


    /**
     * Taux de présence global de la classe
     */
    private function getTauxPresenceClasse(int $classeId): float
{
    $classe = Classe::with('eleves')->findOrFail($classeId);
    $eleveIds = $classe->eleves->pluck('id');

    $total = Presence::whereIn('eleve_id', $eleveIds)->count();
    $presents = Presence::whereIn('eleve_id', $eleveIds)
        ->where('present', 1) // <- utiliser present au lieu de statut
        ->count();

    return $total > 0 ? round(($presents / $total) * 100, 2) : 0;
}


    /**
     * Taux d'absentéisme
     */
    private function getTauxAbsenteisme(int $classeId): float
    {
        $classe = Classe::with('eleves')->findOrFail($classeId);
        $eleveIds = $classe->eleves->pluck('id');

        $total = Presence::whereIn('eleve_id', $eleveIds)
            ->where('date', '>=', now()->subMonth())
            ->count();
            
        $absents = Presence::whereIn('eleve_id', $eleveIds)
        ->where('date', '>=', now()->subMonth())
        ->where('present', 0)
        ->count();


        return $total > 0 ? round(($absents / $total) * 100, 2) : 0;
    }
}