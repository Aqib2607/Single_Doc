<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['doctor_id']);
            
            // Add the correct foreign key constraint to doctors table
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['doctor_id']);
            
            // Add back the original constraint (if needed)
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};