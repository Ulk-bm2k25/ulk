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
        Schema::create('paiement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('tranche_id')->constrained('tranche_paiement')->onDelete('cascade');
            $table->decimal('montant_paye', 10, 2);
            $table->string('mode_paiement')->default('cash');
            $table->string('reference_paiement')->nullable();
            $table->string('statut', 191)->default('en attente');
            $table->date('date_paiement')->nullable();
            $table->timestamps();
            $table->index('eleve_id');
            $table->index('tranche_id');
            $table->index('statut');
            $table->index('date_paiement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiement');
    }
};
