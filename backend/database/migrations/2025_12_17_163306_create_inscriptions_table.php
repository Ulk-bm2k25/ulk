<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('annee_scolaire_id')->constrained('annee_scolaires_table')->cascadeOnDelete();
            $table->date('date_inscription')->nullable();
            $table->string('statut')->default('inscrit');
            $table->timestamps();
            $table->unique(['eleve_id', 'annee_scolaire_id']);
            $table->index('eleve_id');
            $table->index('annee_scolaire_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
