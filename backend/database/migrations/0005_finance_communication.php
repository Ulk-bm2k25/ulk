<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- COMMUNICATION ---

        // 1. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade'); 
            $table->foreignId('destinataire_id')->constrained('users')->onDelete('cascade'); 
            $table->string('type')->default('info');
            $table->string('titre')->nullable();
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->json('data')->nullable(); 
            $table->timestamps();
        });

        // 2. Modèles de notification
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); 
            $table->string('name');
            $table->string('subject');
            $table->text('content'); 
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // --- FINANCE ---

        // 3. Types de Frais
        Schema::create('frais_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('niveau_scolaire_id')->constrained('niveaux_scolaires')->onDelete('cascade');
            $table->string('nom'); 
            $table->decimal('montant_total', 10, 2);
            $table->string('annee_scolaire');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Tranches
        Schema::create('tranche_paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('frais_type_id')->constrained('frais_types')->onDelete('cascade');
            $table->string('nom'); 
            $table->decimal('montant', 10, 2);
            $table->date('date_limite')->nullable();
            $table->timestamps();
        });

        // 5. Paiements
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('tranche_id')->nullable()->constrained('tranche_paiements')->onDelete('set null');
            
            $table->decimal('montant_paye', 10, 2);
            $table->date('date_paiement')->default(now());
            $table->string('mode_paiement'); 
            $table->string('reference_paiement')->nullable()->unique();
            $table->string('statut')->default('payé'); 
            $table->text('commentaire')->nullable();
            
            $table->timestamps();
        });

        // --- DOCUMENTS ---

        // 6. Documents Élèves
        Schema::create('documents_eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->string('type'); 
            $table->string('chemin_fichier');
            $table->string('nom_original')->nullable();
            $table->date('date_upload')->default(now());
            $table->timestamps();
        });

        // 7. Cartes de Scolarité
        Schema::create('cartes_scolarite', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->string('annee_scolaire');
            $table->string('code_barre')->nullable();
            $table->date('date_generation')->default(now());
            $table->string('statut')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cartes_scolarite');
        Schema::dropIfExists('documents_eleves');
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('tranche_paiements');
        Schema::dropIfExists('frais_types');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('notifications');
    }
};
