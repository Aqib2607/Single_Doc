<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->enum('gender', ['male', 'female', 'other', 'prefer-not-to-say'])->nullable();
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->string('doctor');
            $table->enum('consultation_type', ['in-person', 'telemedicine', 'follow-up', 'consultation'])->nullable();
            $table->text('reason')->nullable();
            $table->boolean('terms_accepted')->default(false);
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};