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
        Schema::create('tranche_paiement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('frais_type_id')->constrained('frais_type')->onDelete('cascade');
            $table->string('nom_tranche');
            $table->decimal('pourcentage_du_total', 5, 2)->default(0.00);
            $table->date('date_limite')->nullable();
            $table->timestamps();
            $table->index('frais_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tranche_paiement');
    }
};
