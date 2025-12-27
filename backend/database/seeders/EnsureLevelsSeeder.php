<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\NiveauScolaire;

class EnsureLevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            1 => ['nom' => 'Maternelle', 'description' => 'Cycle préscolaire'],
            2 => ['nom' => 'Primaire', 'description' => 'Cycle primaire'],
            3 => ['nom' => 'Collège', 'description' => 'Premier cycle secondaire'],
            4 => ['nom' => 'Lycée', 'description' => 'Second cycle secondaire'],
        ];

        foreach ($levels as $id => $data) {
            NiveauScolaire::updateOrCreate(
                ['id' => $id], // Force specific ID if possible, or match by ID
                $data
            );
        }
    }
}
