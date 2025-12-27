<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            $table->string('jour')->nullable()->after('classe_id');
            $table->time('heure_debut')->nullable()->after('jour');
            $table->time('heure_fin')->nullable()->after('heure_debut');
            $table->string('matiere')->nullable()->after('heure_fin');
            $table->string('enseignant')->nullable()->after('matiere');
            $table->foreignId('matiere_id')->nullable()->after('enseignant')->constrained('matieres')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cours', function (Blueprint $table) {
            $table->dropForeign(['matiere_id']);
            $table->dropColumn(['jour', 'heure_debut', 'heure_fin', 'matiere', 'enseignant', 'matiere_id']);
        });
    }
};

