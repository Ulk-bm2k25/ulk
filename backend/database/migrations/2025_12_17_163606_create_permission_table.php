<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('cours')->onDelete('cascade');
            $table->enum('status', ['en_attente', 'approuvee', 'rejetee'])->default('en_attente');
            $table->text('raison')->nullable();
            $table->text('commentaire')->nullable();
            $table->date('date_demande')->nullable();
            $table->date('absence_date')->nullable();
            $table->string('attachment')->nullable();
            $table->timestamps();

            $table->index('eleve_id');
            $table->index('course_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};

