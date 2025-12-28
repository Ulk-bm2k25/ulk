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
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->enum('statut', ['present', 'absent', 'retard'])->default('absent');
            $table->timestamps();
            $table->index('seance_id');
            $table->index('eleve_id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presence');
    }
};
