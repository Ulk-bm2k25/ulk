<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Inscriptions
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annee_scolaires')->onDelete('cascade');
            $table->date('date_inscription')->default(now());
            $table->string('statut')->default('en attente'); 
            $table->text('commentaire')->nullable();
            $table->timestamps();
            
            $table->unique(['eleve_id', 'annee_scolaire_id']);
        });

        // 2. Présence
        Schema::create('presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->date('date');
            $table->string('statut'); 
            $table->string('motif')->nullable();
            $table->foreignId('cours_id')->nullable()->constrained('cours')->onDelete('set null');
            $table->timestamps();
        });

        // 3. Évaluations
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            $table->foreignId('enseignant_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('semestre_id')->nullable()->constrained('semestres')->onDelete('set null');
            
            $table->string('titre');
            $table->date('date');
            $table->integer('coefficient')->default(1);
            $table->integer('note_max')->default(20);
            $table->string('type')->default('devoir'); 
            $table->timestamps();
        });

        // 4. Notes
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_id')->constrained('evaluations')->onDelete('cascade');
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            
            $table->decimal('valeur', 5, 2); 
            $table->text('appreciation')->nullable();
            $table->timestamps();

            $table->unique(['evaluation_id', 'eleve_id']);
        });

        // 5. Bulletins
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('semestre_id')->nullable()->constrained('semestres')->onDelete('cascade');
            $table->string('annee_scolaire');
            
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->integer('rang')->nullable();
            $table->text('appreciation_conseil')->nullable();
            $table->string('fichier_pdf')->nullable(); 
            $table->boolean('est_publie')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bulletins');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('evaluations');
        Schema::dropIfExists('presence');
        Schema::dropIfExists('inscriptions');
    }
};
