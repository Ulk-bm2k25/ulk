<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // AnneeScolaires
        $anneeId = DB::table('annee_scolaires_table')->insertGetId([
            'annee' => '2025-2026',
            'date_debut' => '2025-09-01',
            'date_fin' => '2026-06-30',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Users
        $adminId = DB::table('users')->insertGetId([
            'nom' => 'Admin',
            'prenom' => 'System',
            'username' => 'admin',
            'password_hash' => Hash::make('password123'),
            'email' => 'admin@example.com',
            'role' => 'RESPONSABLE',
        ]);

        $parentId = DB::table('users')->insertGetId([
            'nom' => 'Doe',
            'prenom' => 'John',
            'username' => 'parent1',
            'password_hash' => Hash::make('password456'),
            'email' => 'parent1@example.com',
            'role' => 'PARENT',
        ]);

        $eleveUserId = DB::table('users')->insertGetId([
            'nom' => 'Smith',
            'prenom' => 'Alice',
            'username' => 'alice',
            'password_hash' => Hash::make('password789'),
            'email' => 'alice_test@example.com',
            'role' => 'ELEVE',
        ]);

        // ParentsTuteurs
        DB::table('parents_tuteurs')->insert([
            'user_id' => $parentId,
            'nom' => 'Doe',
            'prenom' => 'John',
            'telephone' => '123456789',
            'email' => 'parent1@example.com',
            'adresse' => '123 Rue Exemple',
            'profession' => 'Ingénieur',
        ]);

        // NiveauxScolaires
        $niveauId = DB::table('niveaux_scolaires')->insertGetId([
            'nom' => 'Primaire',
            'description' => 'Niveau primaire',
        ]);

        // Cycles
        $cycleId = DB::table('cycles')->insertGetId([
            'nom' => 'Cycle 1',
            'niveau_id' => $niveauId,
            'description' => 'Premier cycle primaire',
        ]);

        // Classes
        $classeId = DB::table('classes')->insertGetId([
            'nom' => 'Classe 1A',
            'niveau_id' => $niveauId,
            'annee_scolaire' => '2025-2026',
            'description' => 'Classe de test',
        ]);

        // Eleves
        $eleveId = DB::table('eleves')->insertGetId([
            'user_id' => $eleveUserId,
            'classe_id' => $classeId,
            'sexe' => 'F',
            'age' => 10,
        ]);

        // Inscriptions
        DB::table('inscriptions')->insert([
            'eleve_id' => $eleveId,
            'annee_scolaire_id' => $anneeId,
            'statut' => 'inscrit',
        ]);

        // Notifications
        DB::table('notifications')->insert([
            'type' => 'info',
            'message' => 'Nouvelle inscription confirmée',
            'destinataire_id' => $parentId,
            'lu' => false,
        ]);

        // LogsActivite
        DB::table('logs_activite')->insert([
            ['user_id' => $adminId, 'action' => 'login', 'details' => 'Admin connecté avec succès'],
            ['user_id' => $parentId, 'action' => 'view_inscription', 'details' => 'Parent a vu l\'inscription de l\'élève'],
        ]);
    }
}

