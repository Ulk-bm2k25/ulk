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
        Schema::create('presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->foreignId('cours_id')->nullable()->constrained('cours')->onDelete('set null');
            $table->foreignId('eleve_id')->nullable()->constrained('eleves')->onDelete('set null');
            $table->date('date');
            $table->string('heure');
            $table->boolean('present')->default(false);
            $table->timestamps();
            $table->index('classe_id');
            $table->index('cours_id');
            $table->index('eleve_id');
            $table->index('date');
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
