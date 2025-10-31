<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vitals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->string('vital_type');
            $table->decimal('value', 8, 2);
            $table->string('unit', 20);
            $table->timestamp('recorded_at');
            $table->string('recorded_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->index(['patient_id', 'vital_type', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vitals');
    }
};