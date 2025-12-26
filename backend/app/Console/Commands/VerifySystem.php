<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Eleve;
use App\Models\Classe;
use App\Models\Inscription;
use App\Models\Note;
use App\Models\ParentTuteur;

class VerifySystem extends Command
{
    protected $signature = 'verify:system';
    protected $description = 'Runs a full integrity check of the School-HUB system.';

    public function handle()
    {
        $this->info('Starting System Verification...');

        // 1. Database Connectivity
        try {
            \DB::connection()->getPdo();
            $this->info('✅ Database connection established.');
        } catch (\Exception $e) {
            $this->error('❌ Database connection failed: ' . $e->getMessage());
            return 1;
        }

        // 2. Core Data Counts
        $counts = [
            'Users' => User::count(),
            'Teachers' => User::where('role', 'ENSEIGNANT')->count(),
            'Parents' => ParentTuteur::count(),
            'Students' => Eleve::count(),
            'Classes' => Classe::count(),
            'Inscriptions' => Inscription::count(),
        ];
        
        $this->table(['Entity', 'Count'], array_map(function($k, $v) { return [$k, $v]; }, array_keys($counts), $counts));

        // 3. User Roles Integrity
        $invalidUsers = User::whereNotIn('role', ['ADMIN', 'ENSEIGNANT', 'PARENT', 'ELEVE'])->count();
        if ($invalidUsers > 0) {
            $this->error("❌ Found $invalidUsers users with invalid roles.");
        } else {
            $this->info('✅ All user roles are valid.');
        }

        // 4. Student-Class Integrity
        $studentsTotal = Eleve::count();
        if ($studentsTotal > 0) {
            $studentsWithoutClass = Eleve::whereNull('classe_id')->count();
            if ($studentsWithoutClass > 0) {
                $this->warn("⚠️ Found $studentsWithoutClass students not assigned to any class.");
            } else {
                $this->info('✅ All students are assigned to a class.');
            }
        }

        // 5. Parent-Child Integrity
        $orphanedStudents = Eleve::doesntHave('tuteurs')->count();
        if ($orphanedStudents > 0) {
            $this->warn("⚠️ Found $orphanedStudents students without a linked parent.");
        } else {
            $this->info('✅ All students are linked to a parent.');
        }

        // 6. Inscription Status
        $pending = Inscription::where('statut', 'en attente')->count();
        $this->info("ℹ️ Pending Inscriptions: $pending");

        // 7. Grades Check
        $grades = Note::count();
        if ($grades > 0) {
            $orphanedGrades = Note::whereDoesntHave('eleve')->count();
            if ($orphanedGrades > 0) {
                $this->error("❌ Found $orphanedGrades grades linked to deleted students.");
            } else {
                $this->info('✅ All grades are linked to valid students.');
            }
        } else {
            $this->warn('⚠️ No grades found in the system yet.');
        }

        // 8. Class Capacity Check
        $saturatedClasses = Classe::all()->filter(function ($c) {
            return $c->eleves()->count() > $c->capacity_max;
        });
        
        if ($saturatedClasses->count() > 0) {
            $this->warn("⚠️ Found {$saturatedClasses->count()} saturated classes:");
            foreach($saturatedClasses as $c) {
                $this->line("   - {$c->nom}: {$c->eleves_count}/{$c->capacity_max}");
            }
        } else {
            $this->info('✅ All classes are within capacity limits.');
        }

        $this->info('-----------------------------------');
        $this->info('System Verification Complete.');
        return 0;
    }
}
