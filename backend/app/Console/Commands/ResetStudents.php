<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\Note;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;

class ResetStudents extends Command
{
    protected $signature = 'reset:students';
    protected $description = 'Deletes all student data (students, inscriptions, grades, attendance) but keeps classes and admins.';

    public function handle()
    {
        if (!$this->confirm('This will permanently delete ALL students, grades, and inscriptions. Are you sure?')) {
            return;
        }

        $this->info('Allocating cleanup...');

        DB::beginTransaction();
        try {
            // 1. Delete dependent data first
            $this->info('Deleting Grades...');
            Note::truncate();

            $this->info('Deleting Attendance...');
            Attendance::truncate();

            $this->info('Deleting Inscriptions...');
            Inscription::truncate();

            // 2. Detach Parents (Pivot table)
            $this->info('Unlinking Parents...');
            DB::table('relations_eleve_tuteur')->truncate();

            // 3. Delete Eleves
            $this->info('Deleting Student Profiles...');
            // We need to get IDs to delete associated Users later
            $studentUserIds = Eleve::pluck('user_id')->toArray();
            Eleve::truncate();

            // 4. Delete Users (Role = ELEVE)
            $this->info('Deleting Student User Accounts...');
            User::whereIn('id', $studentUserIds)->delete();
            // Just to be safe, also delete any user with role ELEVE that might have been missed
            User::where('role', 'ELEVE')->delete();

            DB::commit();
            $this->info('✅ Student data reset successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ Error during reset: ' . $e->getMessage());
        }
    }
}
