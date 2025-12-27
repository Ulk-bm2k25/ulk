<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Table pour stocker les templates de notifications configurables
     */
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Nom unique du template (ex: payment_reminder, urgent_info)');
            $table->string('subject')->comment('Sujet de l\'email');
            $table->text('body')->comment('Corps du template avec variables {{variable}}');
            $table->enum('type', ['payment_reminder', 'urgent_info', 'general'])->comment('Type de notification');
            $table->boolean('is_active')->default(true)->comment('Template actif ou non');
            $table->json('variables')->nullable()->comment('Variables disponibles pour ce template');
            $table->text('description')->nullable()->comment('Description du template');
            $table->timestamps();
            
            $table->index('type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};

