<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // AnneeScolaires
        DB::table('annee_scolaires')->insert([
            'annee' => '2025-2026',
            'date_debut' => '2025-09-01',
            'date_fin' => '2026-06-30',
        ]);

        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Users
        DB::table('users')->insert([
            ['username' => 'admin', 'password_hash' => Hash::make('password123'), 'email' => 'admin@example.com', 'role' => 'admin'],
            ['username' => 'parent1', 'password_hash' => Hash::make('password456'), 'email' => 'parent1@example.com', 'role' => 'parent'],
        ]);

        // ParentsTuteurs
        DB::table('parents_tuteurs')->insert([
            'user_id' => 2,
            'nom' => 'Doe',
            'prenom' => 'John',
            'telephone' => '123456789',
            'email' => 'parent1@example.com',
            'adresse' => '123 Rue Exemple',
            'profession' => 'Ingénieur',
        ]);

        // Eleves
        DB::table('eleves')->insert([
            'nom' => 'Smith',
            'prenom' => 'Alice',
            'date_naissance' => '2010-05-15',
            'sexe' => 'F',
            'matricule' => 'MAT001',
            'lieu_naissance' => 'Paris',
        ]);

        // RelationsEleveTuteur
        DB::table('relations_eleve_tuteur')->insert([
            'eleve_id' => 1,
            'tuteur_id' => 1,
            'relation_type' => 'pere',
        ]);

        // NiveauxScolaires
        DB::table('niveaux_scolaires')->insert([
            'nom' => 'Primaire',
            'description' => 'Niveau primaire',
        ]);

        // Cycles
        DB::table('cycles')->insert([
            'nom' => 'Cycle 1',
            'niveau_id' => 1,
            'description' => 'Premier cycle primaire',
        ]);

        // Classes
        DB::table('classes')->insert([
            'nom' => 'Classe 1A',
            'capacite' => 25,
            'cycle_id' => 1,
            'annee_scolaire_id' => 1,
        ]);

        // AffectationsClasses
        DB::table('affectations_classes')->insert([
            'eleve_id' => 1,
            'classe_id' => 1,
            'statut' => 'affecte',
        ]);

        // Inscriptions
        DB::table('inscriptions')->insert([
            'eleve_id' => 1,
            'annee_scolaire_id' => 1,
            'statut' => 'inscrit',
        ]);

        // DocumentsEleves
        DB::table('documents_eleves')->insert([
            'eleve_id' => 1,
            'type' => 'certificat_naissance',
            'url' => '/docs/certificat.jpg',
        ]);

        // FichesInscription
        DB::table('fiches_inscription')->insert([
            'inscription_id' => 1,
            'details' => 'Détails de la fiche: signature parent',
            'url' => '/fiches/fiche1.pdf',
        ]);

        // CartesScolarite
        DB::table('cartes_scolarite')->insert([
            'eleve_id' => 1,
            'numero_carte' => 'CARD001',
            'date_expiration' => '2026-06-30',
            'statut' => 'valide',
        ]);

        // Notifications
        DB::table('notifications')->insert([
            'type' => 'info',
            'message' => 'Nouvelle inscription confirmée',
            'destinataire_id' => 2,
            'lu' => false,
        ]);

        // PreferencesNotifications
        DB::table('preferences_notifications')->insert([
            'user_id' => 2,
            'notification_type' => 'info',
            'via_email' => true,
            'via_sms' => true,
        ]);

        // LogsActivite
        DB::table('logs_activite')->insert([
            ['user_id' => 1, 'action' => 'login', 'details' => 'Admin connecté avec succès'],
            ['user_id' => 2, 'action' => 'view_inscription', 'details' => 'Parent a vu l\'inscription de l\'élève'],
        ]);
    }
}
