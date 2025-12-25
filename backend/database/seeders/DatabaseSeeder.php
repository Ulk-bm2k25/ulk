<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Eleve;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un niveau de test
        $niveauId = DB::table('niveaux_scolaires')->insertGetId([
            'nom' => 'Terminale',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Créer une année scolaire de test
        $anneeId = DB::table('annee_scolaires')->insertGetId([
            'annee' => '2024-2025',
            'date_debut' => '2024-09-01',
            'date_fin' => '2025-06-30',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // Créer une classe de test
        $classeId = DB::table('classes')->insertGetId([
            'nom' => 'Terminale A',
            'niveau_id' => $niveauId,
            'annee_scolaire' => $anneeId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Créer des utilisateurs pour les élèves
        $user1 = User::create([
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $user2 = User::create([
            'name' => 'Marie Martin',
            'email' => 'marie.martin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $user3 = User::create([
            'name' => 'Pierre Bernard',
            'email' => 'pierre.bernard@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Créer un enseignant
        $teacher = User::create([
            'name' => 'Prof. Martin',
            'email' => 'prof.martin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Créer une série de test
        $serieId = DB::table('series')->insertGetId([
            'nom' => 'Scientifique', // ou Littéraire, Éco, etc.
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // Créer les élèves
        Eleve::create([
            'user_id' => $user1->id,
            'classe_id' => $classeId,
            'serie_id' => $serieId,
        ]);

        Eleve::create([
            'user_id' => $user2->id,
            'classe_id' => $classeId,
            'serie_id' => $serieId,
        ]);

        Eleve::create([
            'user_id' => $user3->id,
            'classe_id' => $classeId,
            'serie_id' => $serieId,
        ]);

        // Créer des cours
        Course::create([
            'subject' => 'Mathématiques',
            'classe_id' => $classeId,
            'teacher_id' => $teacher->id,
        ]);

        Course::create([
            'subject' => 'Français',
            'classe_id' => $classeId,
            'teacher_id' => $teacher->id,
        ]);

        Course::create([
            'subject' => 'Physique-Chimie',
            'classe_id' => $classeId,
            'teacher_id' => $teacher->id,
        ]);

        Course::create([
            'subject' => 'Histoire-Géographie',
            'classe_id' => $classeId,
            'teacher_id' => $teacher->id,
        ]);

        echo "✅ Données de test créées avec succès!\n";
        echo "   - 1 classe\n";
        echo "   - 3 élèves\n";
        echo "   - 4 cours\n";
    }
}
