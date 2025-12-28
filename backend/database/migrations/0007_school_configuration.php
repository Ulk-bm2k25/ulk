<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('school_acronym')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->string('director_name')->nullable();
            $table->string('director_signature_path')->nullable();
            $table->json('additional_info')->nullable(); // Pour stocker d'autres infos flexibles
            $table->timestamps();
        });

        // Insérer une configuration par défaut
        DB::table('school_configurations')->insert([
            'school_name' => 'École Primaire',
            'school_acronym' => 'EP',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('school_configurations');
    }
};

