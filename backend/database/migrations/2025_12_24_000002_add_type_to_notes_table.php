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
        Schema::table('notes', function (Blueprint $table) {
            $table->string('type')->nullable()->after('valeur')->comment('interro, devoir, composition, etc.');
            $table->string('statut')->default('pending')->after('type')->comment('pending, approved, rejected');
            $table->foreignId('validated_by')->nullable()->after('statut')->constrained('users')->onDelete('set null');
            $table->timestamp('validated_at')->nullable()->after('validated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->dropForeign(['validated_by']);
            $table->dropColumn(['type', 'statut', 'validated_by', 'validated_at']);
        });
    }
};

