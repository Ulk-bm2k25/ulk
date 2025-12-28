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
        // 1. Niveaux Scolaires
        $niveauSeconde = DB::table('niveaux_scolaires')->insertGetId(['nom' => 'Seconde', 'created_at' => now(), 'updated_at' => now()]);
        $niveauPremiere = DB::table('niveaux_scolaires')->insertGetId(['nom' => 'Première', 'created_at' => now(), 'updated_at' => now()]);
        $niveauTerminale = DB::table('niveaux_scolaires')->insertGetId(['nom' => 'Terminale', 'created_at' => now(), 'updated_at' => now()]);

        // 2. Année Scolaire
        $anneeId = DB::table('annee_scolaires')->insertGetId([
            'annee' => '2024-2025',
            'date_debut' => '2024-09-01',
            'date_fin' => '2025-06-30',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Classes
        $classes = [
            ['nom' => 'Seconde A', 'niveau_id' => $niveauSeconde],
            ['nom' => 'Première A', 'niveau_id' => $niveauPremiere],
            ['nom' => 'Terminale A', 'niveau_id' => $niveauTerminale],
            ['nom' => 'Terminale B', 'niveau_id' => $niveauTerminale],
        ];

        $classeIds = [];
        foreach ($classes as $classe) {
            $classeIds[$classe['nom']] = DB::table('classes')->insertGetId([
                'nom' => $classe['nom'],
                'niveau_id' => $classe['niveau_id'],
                'annee_scolaire' => $anneeId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Matières
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
            $matiereObj = \App\Models\Matiere::create($m);
            $matiereIds[$m['nom']] = $matiereObj->id;
        }

        // 5. Enseignants (Users + Enseignant logic)
        $profMath = User::create([
            'name' => 'Prof. Martin (Maths)', 
            'email' => 'math@school.com', 
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);
        $profPhys = User::create([
            'name' => 'Prof. Curie (Phys)', 
            'email' => 'phys@school.com', 
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);
        $profLettres = User::create([
            'name' => 'Prof. Molière (Lettres)', 
            'email' => 'lettres@school.com', 
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        $ensMath = \App\Models\Enseignant::create(['user_id' => $profMath->id, 'matiere' => 'Mathématiques']);
        $ensPhys = \App\Models\Enseignant::create(['user_id' => $profPhys->id, 'matiere' => 'Physique-Chimie']);
        $ensLettres = \App\Models\Enseignant::create(['user_id' => $profLettres->id, 'matiere' => 'Français']);

        // 6. Élèves (5 par classe)
        $noms = ['Dupont', 'Durand', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Simon', 'Michel', 'Lefebvre'];
        $prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Thomas', 'Léa', 'Nicolas', 'Chloé'];

        $serieId = DB::table('series')->insertGetId(['nom' => 'Générale', 'created_at' => now(), 'updated_at' => now()]);

        foreach ($classeIds as $nomClasse => $cid) {
            for ($i = 0; $i < 5; $i++) {
                $nom = $noms[array_rand($noms)];
                $prenom = $prenoms[array_rand($prenoms)];
                $email = strtolower($prenom . '.' . $nom . rand(10, 99) . '@student.com');
                
                $u = User::create([
                    'name' => "$prenom $nom",
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]);

                Eleve::create([
                    'user_id' => $u->id,
                    'classe_id' => $cid,
                    'serie_id' => $serieId,
                ]);
            }
        }

        // 7. Cours (Planning pour Terminale A)
        // Lundi 8h-10h Maths, 10h-12h Physique
        $termA = $classeIds['Terminale A'];
        
        // Helper pour créer cours
        $createCourse = function($classe, $matiereId, $ensId, $jour, $debut, $fin) {
             Course::create([
                'classe_id' => $classe,
                'matiere_id' => $matiereId,
                'enseignant_id' => $ensId,
                'jour' => $jour,
                'heure_debut' => $debut,
                'heure_fin' => $fin,
                'salle' => 'Salle ' . rand(101, 105)
             ]);
        };

        // 7. Cours (Planning complet pour TOUTES les classes)
        $joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        
        foreach ($classeIds as $nomClasse => $classeId) {
            foreach ($joursSemaine as $jour) {
                // 08h-10h : Toujours cours
                $createCourse($classeId, $matiereIds['Mathématiques'], $ensMath->id, $jour, '08:00:00', '10:00:00');
                
                // 10h-12h : Toujours cours
                $createCourse($classeId, $matiereIds['Physique-Chimie'], $ensPhys->id, $jour, '10:00:00', '12:00:00');
                
                // Après-midi sauf Samedi
                if ($jour !== 'Samedi') {
                    $createCourse($classeId, $matiereIds['Français'], $ensLettres->id, $jour, '14:00:00', '16:00:00');
                    $createCourse($classeId, $matiereIds['Anglais'], $ensLettres->id, $jour, '16:00:00', '18:00:00');
                }
            }
        }
        
        echo "✅ Base de données initialisée avec succès :\n";
        echo "   - 3 Niveaux, 1 Année, 4 Classes\n";
        echo "   - 6 Matières, 3 Enseignants\n";
        echo "   - 20 Élèves répartis\n";
        echo "   - Planning de cours généré (incluant des cours pour aujourd'hui)\n";
    }
}
