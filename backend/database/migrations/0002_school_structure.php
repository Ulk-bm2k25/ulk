<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Années
        Schema::create('annee_scolaires', function (Blueprint $table) {
            $table->id();
            $table->string('annee')->unique();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('est_actif')->default(false);
            $table->timestamps();
        });

        // 2. Niveaux
        Schema::create('niveaux_scolaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Cycles
        Schema::create('cycles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('niveau_id')->constrained('niveaux_scolaires')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Séries
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 5. Matières
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code')->nullable();
            $table->integer('coefficient_defaut')->default(1);
            $table->string('couleur')->nullable();
            $table->timestamps();
        });

        // 6. Semestres
        Schema::create('semestres', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); 
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->boolean('est_actif')->default(false);
            $table->timestamps();
        });

        // 7. Classes
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('niveau_id')->constrained('niveaux_scolaires')->onDelete('cascade');
            $table->string('annee_scolaire');
            $table->text('description')->nullable();
            $table->integer('capacity_max')->default(30);
            $table->integer('current_students')->default(0);
            $table->timestamps();
            
            $table->unique(['nom', 'annee_scolaire']);
        });
        
        // 8. Cours
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            $table->foreignId('enseignant_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->string('jour'); 
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('salle')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cours');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('semestres');
        Schema::dropIfExists('matieres');
        Schema::dropIfExists('series');
        Schema::dropIfExists('cycles');
        Schema::dropIfExists('niveaux_scolaires');
        Schema::dropIfExists('annee_scolaires');
    }
};
