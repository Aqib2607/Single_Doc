<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            // Drop existing foreign key constraints if they exist
            try {
                $table->dropForeign(['patient_id']);
            } catch (Exception $e) {
                // Ignore if constraint doesn't exist
            }
            
            try {
                $table->dropForeign(['doctor_id']);
            } catch (Exception $e) {
                // Ignore if constraint doesn't exist
            }
            
            // Add correct foreign key constraints
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->dropForeign(['patient_id']);
            $table->dropForeign(['doctor_id']);
        });
    }
};