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
        Schema::create('cycles', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 191);
            $table->foreignId('niveau_id')->constrained('niveaux_scolaires')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unique(['nom', 'niveau_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cycles');
    }
};
