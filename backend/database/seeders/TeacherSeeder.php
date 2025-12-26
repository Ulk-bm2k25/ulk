<?php

namespace Database\Seeders;

use App\Models\Enseignant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function() {
            $u1 = User::create([
                'nom' => 'Koffi',
                'prenom' => 'Jean',
                'username' => 'jean.koffi',
                'email' => 'jean.koffi@example.com',
                'password_hash' => Hash::make('password123'),
                'role' => 'ENSEIGNANT'
            ]);

            Enseignant::create([
                'user_id' => $u1->id,
                'matiere' => 'Mathématiques'
            ]);

            $u2 = User::create([
                'nom' => 'Sosso',
                'prenom' => 'Marie',
                'username' => 'marie.sosso',
                'email' => 'marie.sosso@example.com',
                'password_hash' => Hash::make('password123'),
                'role' => 'ENSEIGNANT'
            ]);

            Enseignant::create([
                'user_id' => $u2->id,
                'matiere' => 'Français'
            ]);
        });
    }
}
