<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affectations_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->date('date_affectation')->default(now());
            $table->string('statut')->default('affecte'); // affecte, desaffecte, transfere
            $table->text('commentaire')->nullable();
            $table->timestamps();
            
            $table->unique(['eleve_id', 'classe_id']);
            $table->index('eleve_id');
            $table->index('classe_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations_classes');
    }
};

