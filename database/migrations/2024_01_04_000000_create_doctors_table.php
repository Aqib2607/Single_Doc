<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id('doctor_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('specialization');
            $table->string('license_number');
            $table->text('bio')->nullable();
            $table->string('phone');
            $table->json('availability')->nullable();
            $table->decimal('consultation_fee', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};