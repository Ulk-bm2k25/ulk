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
        Schema::create('remboursement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paiement_id')->constrained('paiement')->onDelete('cascade');
            $table->decimal('montant_rembourse', 10, 2);
            $table->text('motif')->nullable();
            $table->string('statut', 191)->default('initié');
            $table->date('date_remboursement')->nullable();
            $table->timestamps();
            $table->index('paiement_id');
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remboursement');
    }
};
