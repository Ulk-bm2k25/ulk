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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->text('message');
            $table->foreignId('destinataire_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_envoi')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->boolean('lu')->default(false);
            $table->timestamps();
            $table->index('destinataire_id');
            $table->index('user_id');
            $table->index('date_envoi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
