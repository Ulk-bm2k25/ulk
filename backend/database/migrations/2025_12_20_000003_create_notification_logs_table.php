<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Table pour logger tous les événements liés aux notifications (envoi, ouverture, clic)
     */
    public function up(): void
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained('email_notifications')->onDelete('cascade');
            $table->enum('event_type', ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'])->comment('Type d\'événement');
            $table->string('recipient_email')->comment('Email du destinataire');
            $table->ipAddress('ip_address')->nullable()->comment('Adresse IP du destinataire');
            $table->text('user_agent')->nullable()->comment('User agent du navigateur');
            $table->string('clicked_url')->nullable()->comment('URL cliquée (si event_type = clicked)');
            $table->timestamp('event_at')->useCurrent()->comment('Date/heure de l\'événement');
            $table->text('details')->nullable()->comment('Détails additionnels de l\'événement (JSON)');
            $table->timestamps();
            
            $table->index('notification_id');
            $table->index('event_type');
            $table->index('event_at');
            $table->index('recipient_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};

