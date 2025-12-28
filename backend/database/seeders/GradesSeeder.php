<?php

namespace Database\Seeders;

use App\Models\Matiere;
use App\Models\Semestre;
use Illuminate\Database\Seeder;

class GradesSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            ['nom' => 'Mathématiques', 'coefficient' => 4],
            ['nom' => 'Français', 'coefficient' => 4],
            ['nom' => 'Anglais', 'coefficient' => 3],
            ['nom' => 'Physique-Chimie', 'coefficient' => 3],
            ['nom' => 'SVT', 'coefficient' => 2],
        ];

        foreach ($subjects as $subject) {
            Matiere::updateOrCreate(['nom' => $subject['nom']], $subject);
        }

        $semesters = [
            ['nom' => 'Trimestre 1', 'date_debut' => '2025-09-01', 'date_fin' => '2025-12-20'],
            ['nom' => 'Trimestre 2', 'date_debut' => '2026-01-05', 'date_fin' => '2026-03-31'],
            ['nom' => 'Trimestre 3', 'date_debut' => '2026-04-10', 'date_fin' => '2026-06-30'],
        ];

        foreach ($semesters as $semester) {
            Semestre::updateOrCreate(['nom' => $semester['nom']], $semester);
        }
    }
}
