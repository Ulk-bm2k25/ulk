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
        Schema::table('presence', function (Blueprint $table) {
            if (!Schema::hasColumn('presence', 'status')) {
                $table->string('status')->default('present');
            }
        });
        Schema::table('presence', function (Blueprint $table) {
            if (!Schema::hasColumn('presence', 'justified')) {
                $table->boolean('justified')->default(false);
            }
        });
        Schema::table('presence', function (Blueprint $table) {
            if (!Schema::hasColumn('presence', 'reason')) {
                $table->text('reason')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presence', function (Blueprint $table) {
            $columnToDrop = [];
            if (Schema::hasColumn('presence', 'status')) $columnToDrop[] = 'status';
            if (Schema::hasColumn('presence', 'justified')) $columnToDrop[] = 'justified';
            if (Schema::hasColumn('presence', 'reason')) $columnToDrop[] = 'reason';
            
            if (count($columnToDrop) > 0) {
                $table->dropColumn($columnToDrop);
            }
        });
    }
};
