<?php
<?php

namespace Database\Seeders;

use App\Models\Eleve;
use App\Models\Course;
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
        // --- Années scolaires (conserver les deux années sans doublons)
        $annee2024 = AnneeScolaire::firstOrCreate(
            ['annee' => '2024-2025'],
            ['date_debut' => '2024-09-01', 'date_fin' => '2025-06-30', 'est_actif' => false]
        );

        $annee2025 = AnneeScolaire::firstOrCreate(
            ['annee' => '2025-2026'],
            ['date_debut' => '2025-09-01', 'date_fin' => '2026-06-30', 'est_actif' => true]
        );

        // --- Niveaux scolaires (fusion des listes)
        $niveaux = [
            'Maternelle' => 'Petite, Moyenne et Grande Section',
            'Primaire' => 'CP, CE1, CE2, CM1, CM2',
            'Collège' => '6ème, 5ème, 4ème, 3ème',
            'Lycée' => '2nde, 1ère, Terminale',
            'Seconde' => 'Seconde',
            'Première' => 'Première',
            'Terminale' => 'Terminale',
        ];

        foreach ($niveaux as $nom => $desc) {
            NiveauScolaire::firstOrCreate(
                ['nom' => $nom],
                ['description' => $desc]
            );
        }

        $seconde = NiveauScolaire::where('nom', 'Seconde')->first();
        $premiere = NiveauScolaire::where('nom', 'Première')->first();
        $terminale = NiveauScolaire::where('nom', 'Terminale')->first();
        $college = NiveauScolaire::where('nom', 'Collège')->first();
        $primaire = NiveauScolaire::where('nom', 'Primaire')->first();

        // --- Classes (conserver les deux jeux, éviter doublons)
        $classesToCreate = [
            ['nom' => 'Seconde A', 'niveau_id' => $seconde?->id, 'annee_scolaire' => $annee2024->annee, 'capacity_max' => 30],
            ['nom' => 'Première A', 'niveau_id' => $premiere?->id, 'annee_scolaire' => $annee2024->annee, 'capacity_max' => 30],
            ['nom' => 'Terminale A', 'niveau_id' => $terminale?->id, 'annee_scolaire' => $annee2024->annee, 'capacity_max' => 30],
            ['nom' => 'Terminale B', 'niveau_id' => $terminale?->id, 'annee_scolaire' => $annee2024->annee, 'capacity_max' => 30],
            ['nom' => '6ème A', 'niveau_id' => $college?->id, 'annee_scolaire' => $annee2025->annee, 'capacity_max' => 35],
            ['nom' => 'CP A', 'niveau_id' => $primaire?->id, 'annee_scolaire' => $annee2025->annee, 'capacity_max' => 30],
        ];

        $classeIds = [];
        foreach ($classesToCreate as $cData) {
            if (empty($cData['niveau_id'])) {
                continue;
            }
            $classe = Classe::firstOrCreate(
                ['nom' => $cData['nom']],
                [
                    'niveau_id' => $cData['niveau_id'],
                    'annee_scolaire' => $cData['annee_scolaire'],
                    'capacity_max' => $cData['capacity_max'] ?? null,
                ]
            );
            $classeIds[$classe->nom] = $classe->id;
        }

        // --- Matières
        $matieres = [
            ['nom' => 'Mathématiques', 'coefficient' => 5],
            ['nom' => 'Physique-Chimie', 'coefficient' => 4],
            ['nom' => 'SVT', 'coefficient' => 3],
            ['nom' => 'Français', 'coefficient' => 3],
            ['nom' => 'Anglais', 'coefficient' => 2],
            ['nom' => 'Histoire-Géographie', 'coefficient' => 3],
        ];

        $matiereIds = [];
        foreach ($matieres as $m) {
            $matiere = \App\Models\Matiere::firstOrCreate(['nom' => $m['nom']], $m);
            $matiereIds[$m['nom']] = $matiere->id;
        }

        // --- Enseignants / Users (éviter doublons via email)
        $profMath = User::firstOrCreate(
            ['email' => 'math@school.com'],
            ['name' => 'Prof. Martin (Maths)', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $profPhys = User::firstOrCreate(
            ['email' => 'phys@school.com'],
            ['name' => 'Prof. Curie (Phys)', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        $profLettres = User::firstOrCreate(
            ['email' => 'lettres@school.com'],
            ['name' => 'Prof. Molière (Lettres)', 'password' => Hash::make('password'), 'email_verified_at' => now()]
        );

        \App\Models\Enseignant::firstOrCreate(
            ['user_id' => $profMath->id],
            ['matiere' => 'Mathématiques']
        );
        \App\Models\Enseignant::firstOrCreate(
            ['user_id' => $profPhys->id],
            ['matiere' => 'Physique-Chimie']
        );
        \App\Models\Enseignant::firstOrCreate(
            ['user_id' => $profLettres->id],
            ['matiere' => 'Français']
        );

        // --- Autres comptes (admin, parent) -- en évitant doublons par email
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@schoolhub.local'],
            ['name' => 'Admin Principal', 'password' => Hash::make('admin123'), 'email_verified_at' => now(), 'role' => 'ADMIN']
        );

        $parentUser = User::firstOrCreate(
            ['email' => 'parent@schoolhub.local'],
            ['name' => 'Jean Dupont', 'password' => Hash::make('parent123'), 'email_verified_at' => now(), 'role' => 'PARENT']
        );

        ParentTuteur::firstOrCreate(
            ['user_id' => $parentUser->id],
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'telephone' => '+33123456789',
                'email' => $parentUser->email,
                'adresse' => "10 Rue de l'École, 75001 Paris",
                'profession' => 'Comptable',
            ]
        );

        // --- Séries
        $serie = DB::table('series')->where('nom', 'Générale')->first();
        if (!$serie) {
            $serieId = DB::table('series')->insertGetId([
                'nom' => 'Générale',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $serieId = $serie->id;
        }

        // --- Élèves : 5 par classe (si pas déjà créés)
        $noms = ['Dupont', 'Durand', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Simon', 'Michel', 'Lefebvre'];
        $prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Thomas', 'Léa', 'Nicolas', 'Chloé'];

        foreach ($classeIds as $nomClasse => $cid) {
            $existingCount = Eleve::where('classe_id', $cid)->count();
            for ($i = 0; $i < 5 - $existingCount; $i++) {
                $nom = $noms[array_rand($noms)];
                $prenom = $prenoms[array_rand($prenoms)];
                $email = strtolower($prenom . '.' . $nom . rand(10, 99) . '@student.com');

                $u = User::firstOrCreate(
                    ['email' => $email],
                    ['name' => "$prenom $nom", 'password' => Hash::make('password'), 'email_verified_at' => now()]
                );

                Eleve::firstOrCreate(
                    ['user_id' => $u->id, 'classe_id' => $cid],
                    ['serie_id' => $serieId ?? null]
                );
            }
        }

        // --- Planning de cours (création pour toutes les classes, évite doublons par check simple)
        $ensMath = \App\Models\Enseignant::where('matiere', 'Mathématiques')->first();
        $ensPhys = \App\Models\Enseignant::where('matiere', 'Physique-Chimie')->first();
        $ensLettres = \App\Models\Enseignant::where('matiere', 'Français')->first();

        $joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        $createCourse = function($classe, $matiereId, $ensId, $jour, $debut, $fin) {
            $exists = Course::where([
                'classe_id' => $classe,
                'matiere_id' => $matiereId,
                'jour' => $jour,
                'heure_debut' => $debut,
                'heure_fin' => $fin,
            ])->exists();

            if (!$exists) {
                Course::create([
                    'classe_id' => $classe,
                    'matiere_id' => $matiereId,
                    'enseignant_id' => $ensId,
                    'jour' => $jour,
                    'heure_debut' => $debut,
                    'heure_fin' => $fin,
                    'salle' => 'Salle ' . rand(101, 105)
                ]);
            }
        };

        foreach ($classeIds as $nomClasse => $classeId) {
            foreach ($joursSemaine as $jour) {
                if (isset($matiereIds['Mathématiques']) && $ensMath) {
                    $createCourse($classeId, $matiereIds['Mathématiques'], $ensMath->id, $jour, '08:00:00', '10:00:00');
                }
                if (isset($matiereIds['Physique-Chimie']) && $ensPhys) {
                    $createCourse($classeId, $matiereIds['Physique-Chimie'], $ensPhys->id, $jour, '10:00:00', '12:00:00');
                }
                if ($jour !== 'Samedi' && isset($matiereIds['Français']) && $ensLettres) {
                    $createCourse($classeId, $matiereIds['Français'], $ensLettres->id, $jour, '14:00:00', '16:00:00');
                    $createCourse($classeId, $matiereIds['Anglais'] ?? null, $ensLettres->id, $jour, '16:00:00', '18:00:00');
                }
            }
        }

        // --- Frais types (éviter doublons)
        DB::table('frais_types')->insertOrIgnore([
            [
                'niveau_scolaire_id' => $primaire?->id,
                'nom' => 'Scolarité Primaire',
                'montant_total' => 50000,
                'annee_scolaire' => $annee2025->annee,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'niveau_scolaire_id' => $college?->id,
                'nom' => 'Scolarité Collège',
                'montant_total' => 85000,
                'annee_scolaire' => $annee2025->annee,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        echo "✅ Base de données initialisée / fusionnée avec succès.\n";
    }
}