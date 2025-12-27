<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\NiveauScolaire;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Models\ParentTuteur;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Année Scolaire
        $annee = AnneeScolaire::create([
            'annee' => '2025-2026',
            'date_debut' => '2025-09-01',
            'date_fin' => '2026-06-30',
            'est_actif' => true,
        ]);
        
        // 2. Niveaux Scolaires
        $levels = [
            'Maternelle' => 'Petite, Moyenne et Grande Section',
            'Primaire' => 'CP, CE1, CE2, CM1, CM2',
            'Collège' => '6ème, 5ème, 4ème, 3ème',
            'Lycée' => '2nde, 1ère, Terminale',
        ];
        
        foreach ($levels as $nom => $desc) {
            NiveauScolaire::create(['nom' => $nom, 'description' => $desc]);
        }
        
        $college = NiveauScolaire::where('nom', 'Collège')->first();
        $primaire = NiveauScolaire::where('nom', 'Primaire')->first();

        // 3. Classes de base
        Classe::create([
            'nom' => '6ème A',
            'niveau_id' => $college->id,
            'annee_scolaire' => '2025-2026',
            'capacity_max' => 35,
        ]);
        
        Classe::create([
            'nom' => 'CP A',
            'niveau_id' => $primaire->id,
            'annee_scolaire' => '2025-2026',
            'capacity_max' => 30,
        ]);

        // 4. Utilisateurs : ADMIN
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Principal',
            'username' => 'admin',
            'email' => 'admin@schoolhub.com',
            'password_hash' => Hash::make('password123'), // Default password
            'role' => 'RESPONSABLE',
        ]);

        // 5. Utilisateurs : PARENT DEMO
        $parentUser = User::create([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'username' => 'parent.demo',
            'email' => 'parent@demo.com',
            'password_hash' => Hash::make('password123'),
            'role' => 'PARENT',
        ]);
        
        ParentTuteur::create([
            'user_id' => $parentUser->id,
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'telephone' => '0102030405',
            'email' => 'parent@demo.com',
            'adresse' => '10 Rue de l\'École',
            'profession' => 'Comptable',
        ]);
        
        // 6. Frais (Types)
        DB::table('frais_types')->insert([
            ['niveau_scolaire_id' => $primaire->id, 'nom' => 'Scolarité Primaire', 'montant_total' => 50000, 'annee_scolaire' => '2025-2026', 'created_at' => now(), 'updated_at' => now()],
            ['niveau_scolaire_id' => $college->id, 'nom' => 'Scolarité Collège', 'montant_total' => 85000, 'annee_scolaire' => '2025-2026', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
