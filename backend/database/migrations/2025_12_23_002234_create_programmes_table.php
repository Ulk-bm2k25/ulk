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
        Schema::create('programmes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->string('jour');           // ex: 'Lundi', 'Mardi'
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->timestamps();

            $table->index('classe_id');
            $table->index('course_id');
            $table->index('teacher_id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
