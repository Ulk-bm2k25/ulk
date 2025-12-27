<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Table principale pour les notifications email avec gestion des statuts
     */
    public function up(): void
    {
        Schema::create('email_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->nullable()->constrained('notification_templates')->onDelete('set null')->comment('Template utilisé');
            $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade')->comment('Destinataire (parent/tuteur)');
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null')->comment('Expéditeur (admin)');
            $table->string('subject')->comment('Sujet de l\'email');
            $table->text('body')->comment('Corps du message');
            $table->enum('status', ['draft', 'scheduled', 'sent', 'failed'])->default('draft')->comment('Statut de la notification');
            $table->enum('type', ['payment_reminder', 'urgent_info', 'general'])->comment('Type de notification');
            $table->timestamp('scheduled_at')->nullable()->comment('Date d\'envoi programmée');
            $table->timestamp('sent_at')->nullable()->comment('Date d\'envoi réelle');
            $table->json('metadata')->nullable()->comment('Données supplémentaires (montant, échéance, etc.)');
            $table->text('error_message')->nullable()->comment('Message d\'erreur en cas d\'échec');
            $table->timestamps();
            
            $table->index('recipient_id');
            $table->index('status');
            $table->index('type');
            $table->index('scheduled_at');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_notifications');
    }
};

