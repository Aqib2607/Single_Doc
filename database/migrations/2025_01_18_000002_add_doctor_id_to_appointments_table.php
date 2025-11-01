<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('doctor_id')->nullable()->after('doctor');
            $table->text('medical_notes')->nullable()->after('reason');
            
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('set null');
            $table->index('doctor_id');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['doctor_id']);
            $table->dropColumn(['doctor_id', 'medical_notes']);
        });
    }
};