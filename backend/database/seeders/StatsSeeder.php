<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\Note;
use App\Models\Presence;

class StatsSeeder extends Seeder
{
    public function run(): void
    {
        // ⚠️ Désactiver temporairement les contraintes FK
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Vider les tables
        Presence::truncate();
        Note::truncate();
        Matiere::truncate();
        Eleve::truncate();
        Classe::truncate();
        DB::table('series')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('🗑️  Tables nettoyées...');

        // ========================================
        // 0️⃣ CRÉER DES USERS POUR LES ÉLÈVES
        // ========================================
       // 0️⃣ CRÉER DES USERS POUR LES ÉLÈVES
$users = [
    [
        'nom' => 'Diallo',
        'prenom' => 'Mamadou',
        'username' => 'mamadou.diallo',
        'email' => 'diallo@example.com',
        'password_hash' => bcrypt('password'),
        'role' => 'ELEVE',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'nom' => 'Koffi',
        'prenom' => 'Aya',
        'username' => 'aya.koffi',
        'email' => 'koffi@example.com',
        'password_hash' => bcrypt('password'),
        'role' => 'ELEVE',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'nom' => 'Traoré',
        'prenom' => 'Issa',
        'username' => 'issa.traore',
        'email' => 'traore@example.com',
        'password_hash' => bcrypt('password'),
        'role' => 'ELEVE',
        'created_at' => now(),
        'updated_at' => now(),
    ],
];

$userIds = [];
foreach ($users as $user) {
    $userIds[] = DB::table('users')->insertGetId($user);
}

$this->command->info("✅ " . count($userIds) . " users créés");

        // ========================================
        // 1️⃣ CRÉER UNE SÉRIE
        // ========================================
        $serieId = DB::table('series')->insertGetId([
            'nom' => 'C',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $this->command->info("✅ Série créée : C (ID: $serieId)");

        // ========================================
        // 2️⃣ CRÉER UNE CLASSE
        // ========================================
        $classe = Classe::create([
            'nom' => 'Terminale C',
            'niveau_id' => 1, // Assure-toi que le niveau 1 existe
            'description' => 'Classe terminale C',
            'annee_scolaire' => '2024-2025',
            
        ]);

        $this->command->info("✅ Classe créée : {$classe->nom}");

        // ========================================
        // 3️⃣ CRÉER LES MATIÈRES
        // ========================================
        $matieres = [
            ['nom' => 'Mathématiques', 'coefficient' => 4],
            ['nom' => 'Physique-Chimie', 'coefficient' => 3],
            ['nom' => 'SVT', 'coefficient' => 2],
            ['nom' => 'Français', 'coefficient' => 3],
            ['nom' => 'Anglais', 'coefficient' => 2],
            ['nom' => 'Philosophie', 'coefficient' => 2],
        ];

        $matieresCreated = [];
        foreach ($matieres as $matiere) {
            $matieresCreated[] = Matiere::create([
                'nom' => $matiere['nom'],
                'coefficient' => $matiere['coefficient'],
            ]);
        }

        $this->command->info("✅ " . count($matieresCreated) . " matières créées");

        // ========================================
        // 4️⃣ CRÉER LES ÉLÈVES
        // ========================================
        $eleves = [
            ['nom' => 'Diallo', 'prenom' => 'Mamadou', 'genre' => 'M', 'date_naissance' => '2007-03-15'],
            ['nom' => 'Koffi', 'prenom' => 'Aya', 'genre' => 'F', 'date_naissance' => '2008-07-22'],
            ['nom' => 'Traoré', 'prenom' => 'Issa', 'genre' => 'M', 'date_naissance' => '2007-11-10'],
        ];

        $elevesCreated = [];
        foreach ($eleves as $index => $eleve) {
            $elevesCreated[] = Eleve::create([
                'user_id' => $userIds[$index],
                'classe_id' => $classe->id,
                'serie_id' => $serieId,
            ]);
        }

        $this->command->info("✅ " . count($elevesCreated) . " élèves créés");

        // ========================================
        // 5️⃣ CRÉER LES NOTES
        // ========================================
        $notesCount = 0;
        $semestreId = 1; // Assure-toi que le semestre 1 existe
        foreach ($elevesCreated as $eleve) {
            foreach ($matieresCreated as $matiere) {
                Note::create([
                    'eleve_id' => $eleve->id,
                    'matiere_id' => $matiere->id,
                    'semestre_id' => $semestreId,
                    'valeur' => rand(8, 18) + (rand(0, 99) / 100),
                    'date_note' => now(),
                ]);
                $notesCount++;
            }
        }
        $this->command->info("✅ $notesCount notes créées");

        // ========================================
        // 6️⃣ CRÉER LES PRÉSENCES
        // ========================================
        $presencesCount = 0;
        foreach ($elevesCreated as $eleve) {
            for ($i = 1; $i <= 5; $i++) { // 5 jours de test
                Presence::create([
                    'eleve_id' => $eleve->id,
                    'classe_id' => $classe->id,
                    'cours_id' => null,
                    'date' => now()->subDays($i)->format('Y-m-d'),
                    'heure' => '08:00',
                    'present' => rand(0, 1),
                ]);
                $presencesCount++;
            }
        }
        $this->command->info("✅ $presencesCount présences créées");

        $this->command->info("🎉 Seeder terminé avec succès !");
    }
}
