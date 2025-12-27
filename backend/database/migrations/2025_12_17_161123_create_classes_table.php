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
        Schema::create('classes', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->string('nom', 191);
            $table->unsignedBigInteger('niveau_id');
            $table->foreign('niveau_id')
            ->references('id')
            ->on('niveaux_scolaires')
            ->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('annee_scolaire', 191);
            $table->timestamps();
            $table->unique(['nom', 'niveau_id']);
            $table->index('annee_scolaire');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
