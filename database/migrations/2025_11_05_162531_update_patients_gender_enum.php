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
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
        
        Schema::table('patients', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female', 'other', 'prefer-not-to-say'])->default('prefer-not-to-say')->after('date_of_birth');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
        
        Schema::table('patients', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female', 'other'])->after('date_of_birth');
        });
    }
};
