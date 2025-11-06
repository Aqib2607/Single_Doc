<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_medicines', function (Blueprint $table) {
            $table->dropColumn('duration');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('refills_remaining')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('prescription_medicines', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'refills_remaining']);
            $table->string('duration')->nullable();
        });
    }
};