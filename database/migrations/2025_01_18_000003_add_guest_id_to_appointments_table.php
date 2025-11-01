<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('guest_id')->nullable()->after('patient_id');
            $table->foreign('guest_id')->references('id')->on('guests')->onDelete('cascade');
            $table->index('guest_id');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['guest_id']);
            $table->dropColumn('guest_id');
        });
    }
};