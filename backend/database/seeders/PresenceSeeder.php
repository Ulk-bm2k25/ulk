<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class PresenceSeeder extends Seeder
{
    public function run()
    {
        if (!Schema::hasTable('presences')) {
            $this->command->info('Table "presences" introuvable — adapte le nom si nécessaire.');
            return;
        }

        $this->command->info('🔄 Génération des présences...');

        // Récupérer tous les élèves
        $eleves = DB::table('eleves')->pluck('id')->toArray();
        if (empty($eleves)) {
            $this->command->info('❌ Aucun élève trouvé, exécute d\'abord DatabaseSeeder.');
            return;
        }

        // Récupérer toutes les séances OU créer des séances si la table existe
        $seances = [];
        if (Schema::hasTable('seances')) {
            $seances = DB::table('seances')->pluck('id')->toArray();
            
            // Si pas de séances, en créer quelques-unes
            if (empty($seances)) {
                $this->command->info('📝 Création de séances d\'exemple...');
                $this->createSampleSeances();
                $seances = DB::table('seances')->pluck('id')->toArray();
            }
        }

        // Si toujours pas de séances ET que seance_id est NOT NULL, on doit créer des séances
        if (empty($seances)) {
            $this->command->warn('⚠️  Aucune séance trouvée. Création de séances obligatoires...');
            $this->createSampleSeances();
            $seances = DB::table('seances')->pluck('id')->toArray();
        }

        if (empty($seances)) {
            $this->command->error('❌ Impossible de créer des séances. Vérifiez votre schéma de base de données.');
            return;
        }

        // Générer des présences pour les 7 derniers jours
        $records = [];
        $startDate = Carbon::now()->subDays(6);
        
        for ($day = 0; $day < 7; $day++) {
            $currentDate = $startDate->copy()->addDays($day);
            
            foreach ($eleves as $idx => $eleveId) {
                // Sélectionner une séance aléatoire
                $seanceId = $seances[array_rand($seances)];
                
                // Varier les statuts de manière réaliste
                // 80% présent, 15% absent, 5% retard
                $rand = rand(1, 100);
                if ($rand <= 80) {
                    $statut = 'present';
                } elseif ($rand <= 95) {
                    $statut = 'absent';
                } else {
                    $statut = 'retard';
                }

                $records[] = [
                    'seance_id'  => $seanceId,
                    'eleve_id'   => $eleveId,
                    'statut'     => $statut,
                    'created_at' => $currentDate,
                    'updated_at' => $currentDate,
                ];
            }
        }

        // Insérer par lots de 100 pour éviter les erreurs de mémoire
        $chunks = array_chunk($records, 100);
        foreach ($chunks as $chunk) {
            DB::table('presences')->insert($chunk);
        }

        $this->command->info('✅ Présences insérées : ' . count($records) . ' enregistrements sur 7 jours');
    }

    /**
     * Créer des séances d'exemple basées sur les cours
     */
    private function createSampleSeances()
    {
        if (!Schema::hasTable('seances') || !Schema::hasTable('courses')) {
            $this->command->warn('⚠️  Tables seances ou courses introuvables');
            return;
        }

        // Récupérer tous les cours
        $courses = DB::table('courses')->get();
        
        if ($courses->isEmpty()) {
            $this->command->warn('⚠️  Aucun cours trouvé pour créer des séances');
            return;
        }

        $seances = [];
        $startDate = Carbon::now()->subDays(6);
        
        // Créer des séances pour les 7 derniers jours
        for ($day = 0; $day < 7; $day++) {
            $currentDate = $startDate->copy()->addDays($day);
            $jourActuel = $currentDate->locale('fr')->isoFormat('dddd'); // Lundi, Mardi, etc.
            
            // Pour chaque cours du jour actuel
            foreach ($courses as $course) {
                if (strtolower($course->jour) === strtolower($jourActuel)) {
                    $seances[] = [
                        'course_id'  => $course->id,
                        'date'       => $currentDate->format('Y-m-d'),
                        'heure_debut' => $course->heure_debut,
                        'heure_fin'   => $course->heure_fin,
                        'statut'     => 'completed', // ou 'planned' selon votre schéma
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        if (!empty($seances)) {
            DB::table('seances')->insert($seances);
            $this->command->info('✅ ' . count($seances) . ' séances créées');
        }
    }
}