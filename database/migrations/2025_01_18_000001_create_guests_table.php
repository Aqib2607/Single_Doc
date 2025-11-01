<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->nullable();
            $table->string('phone_number');
            $table->dateTime('appointment_date');
            $table->unsignedBigInteger('doctor_id');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
            
            // Indexes for query optimization
            $table->index('doctor_id');
            $table->index('appointment_date');
            $table->index(['doctor_id', 'appointment_date']);
            $table->index('phone_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};