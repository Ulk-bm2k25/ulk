<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statistique_financiere', function (Blueprint $table) {
            $table->id();
            $table->string('annee_scolaire');
            $table->decimal('total_recettes', 10, 2)->default(0.00);
            $table->decimal('total_remboursements', 10, 2)->default(0.00);
            $table->integer('nombre_eleves_payants')->default(0);
            $table->date('date_generation')->default(DB::raw('CURRENT_DATE'));
            $table->timestamps();
            $table->index('annee_scolaire');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statistique_financiere');
    }
};
