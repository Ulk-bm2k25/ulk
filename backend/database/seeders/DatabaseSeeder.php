<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ParentTuteur;
use App\Models\AnneeScolaire;
use App\Models\NiveauScolaire;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\Cycle;
use App\Models\Series;
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
        $annee = AnneeScolaire::create([
            'annee' => '2025-2026',
            'date_debut' => '2025-09-01',
            'date_fin' => '2026-06-30',
        ]);
        $anneeId = $annee->id;

        $admin = User::create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'username' => 'admin',
            'password_hash' => Hash::make('password123'),
            'email' => 'admin@example.com',
            'role' => 'RESPONSABLE',
        ]);
        $adminId = $admin->id;

        $parentUser = User::create([
            'nom' => 'Doe',
            'prenom' => 'John',
            'username' => 'parent1',
            'password_hash' => Hash::make('password456'),
            'email' => 'parent1@example.com',
            'role' => 'PARENT',
        ]);
        $parentId = $parentUser->id;

        $eleveUser = User::create([
            'nom' => 'Smith',
            'prenom' => 'Alice',
            'username' => 'alice',
            'password_hash' => Hash::make('password789'),
            'email' => 'alice_test@example.com',
            'role' => 'ELEVE',
        ]);
        $eleveUserId = $eleveUser->id;

        ParentTuteur::create([
            'user_id' => $parentId,
            'nom' => 'Doe',
            'prenom' => 'John',
            'telephone' => '123456789',
            'email' => 'parent1@example.com',
            'adresse' => '123 Rue Exemple',
            'profession' => 'Ingénieur',
        ]);

        $niveau = NiveauScolaire::create([
            'nom' => 'Primaire',
            'description' => 'Niveau primaire',
        ]);
        $niveauId = $niveau->id;

        Cycle::create([
            'nom' => 'Cycle 1',
            'niveau_id' => $niveauId,
            'description' => 'Premier cycle primaire',
        ]);

        $classe = Classe::create([
            'nom' => 'Classe 1A',
            'niveau_id' => $niveauId,
            'annee_scolaire' => '2025-2026',
            'description' => 'Classe de test',
        ]);
        $classeId = $classe->id;

        $serie = Series::create([
            'nom' => 'Série Générale',
            'description' => 'Tronc commun',
        ]);
        $serieId = $serie->id;

        $eleve = Eleve::create([
            'user_id' => $eleveUserId,
            'classe_id' => $classeId,
            'serie_id' => $serieId,
            'sexe' => 'F',
            'age' => 10,
        ]);
        $eleveId = $eleve->id;

        Inscription::create([
            'eleve_id' => $eleveId,
            'annee_scolaire_id' => $anneeId,
            'statut' => 'inscrit',
        ]);

        DB::table('notifications')->insert([
            'user_id' => $adminId,
            'type' => 'info',
            'message' => 'Nouvelle inscription confirmée',
            'destinataire_id' => $parentId,
            'lu' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('logs_activite')->insert([
            ['user_id' => $adminId, 'action' => 'login', 'details' => 'Admin connecté avec succès'],
            ['user_id' => $parentId, 'action' => 'view_inscription', 'details' => 'Parent a vu l\'inscription de l\'élève'],
        ]);

        // Seeders pour les notifications
        $this->call([
            NotificationTemplateSeeder::class,
        ]);
    }
}
