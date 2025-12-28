<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Parents / Tuteurs
        Schema::create('parents_tuteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->string('adresse')->nullable();
            $table->string('profession')->nullable();
            $table->timestamps();
        });

        // 2. Enseignants
        Schema::create('enseignants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('specialite')->nullable();
            $table->string('telephone')->nullable();
            $table->date('date_embauche')->nullable();
            $table->timestamps();
        });

        // 3. Responsables
        Schema::create('responsables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('poste')->nullable();
            $table->string('departement')->nullable();
            $table->timestamps();
        });
        
        // 4. Élèves
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->foreignId('serie_id')->nullable()->constrained('series')->onDelete('set null');
            
            $table->string('matricule')->nullable()->unique();
            $table->enum('sexe', ['M', 'F'])->nullable(); 
            $table->date('date_naissance')->nullable();
            $table->string('lieu_naissance')->nullable();
            $table->string('adresse')->nullable();
            $table->string('photo')->nullable();
            $table->integer('age')->nullable();
            
            $table->boolean('est_actif')->default(true);
            $table->timestamps();
        });

        // 5. Relations Elève <-> Parent
        Schema::create('relations_eleve_tuteur', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('tuteur_id')->constrained('parents_tuteurs')->onDelete('cascade');
            
            $table->string('relation_type')->default('PARENT'); 
            $table->boolean('est_responsable_legal')->default(true);
            $table->boolean('contact_urgence')->default(true);
            
            $table->timestamps();
            $table->unique(['eleve_id', 'tuteur_id']);
        });

        // 6. Affectations
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            $table->string('type')->default('enseignant'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations');
        Schema::dropIfExists('relations_eleve_tuteur');
        Schema::dropIfExists('eleves');
        Schema::dropIfExists('responsables');
        Schema::dropIfExists('enseignants');
        Schema::dropIfExists('parents_tuteurs');
    }
};
