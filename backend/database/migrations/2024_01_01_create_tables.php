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
        // Table des étudiants
        if (!Schema::hasTable('etudiants')) {
            Schema::create('etudiants', function (Blueprint $table) {
                $table->id();
                $table->string('matricule', 100)->unique();
                $table->string('nom');
                $table->string('prenom');
                $table->string('classe')->nullable();
                $table->string('telephone')->nullable();
                $table->string('email')->nullable();
                $table->timestamps();
            });
        }

        // Table des remboursements
        if (!Schema::hasTable('remboursements')) {
            Schema::create('remboursements', function (Blueprint $table) {
                $table->id();
                $table->string('numero_dossier', 100)->unique();
                $table->foreignId('etudiant_id')->constrained('etudiants')->onDelete('cascade');
                $table->decimal('montant', 10, 2);
                $table->string('motif');
                $table->text('description')->nullable();
                $table->enum('statut', ['en_attente', 'approuve', 'refuse', 'paye'])->default('en_attente');
                $table->dateTime('date_demande');
                $table->timestamps();
            });
        }

        // Table des paiements (optionnelle)
        if (!Schema::hasTable('paiements')) {
            Schema::create('paiements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('etudiant_id')->constrained('etudiants')->onDelete('cascade');
                $table->string('reference', 100)->unique();
                $table->decimal('montant', 10, 2);
                $table->string('type')->default('scolarite');
                $table->date('date_paiement');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('remboursements');
        Schema::dropIfExists('etudiants');
    }
};