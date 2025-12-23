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
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('subject'); // ajouté
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->foreignId('teacher_id')->nullable()->constrained('users')->onDelete('set null'); // ajouté
            $table->timestamps();
            $table->index('classe_id');
            $table->index('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
