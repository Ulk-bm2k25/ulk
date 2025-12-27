<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// C'est ici que nous définissons explicitement la classe
class CreateAffectationsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            // Le reste de votre définition de table :
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('eleve_id')->nullable()->constrained('eleves')->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained('matieres')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
}