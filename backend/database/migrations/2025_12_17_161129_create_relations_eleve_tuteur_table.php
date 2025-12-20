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
        Schema::create('relations_eleve_tuteur', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('tuteur_id')->constrained('parents_tuteurs')->onDelete('cascade');
            $table->string('relation_type');
            $table->timestamps();
            $table->unique(['eleve_id', 'tuteur_id']);
            $table->index('eleve_id');
            $table->index('tuteur_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relations_eleve_tuteur');
    }
};
