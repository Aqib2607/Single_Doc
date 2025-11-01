<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing appointments with doctor_id based on doctor name
        DB::statement("
            UPDATE appointments 
            SET doctor_id = (
                SELECT doctor_id 
                FROM doctors 
                WHERE doctors.name = appointments.doctor 
                LIMIT 1
            ) 
            WHERE doctor_id IS NULL 
            AND doctor IS NOT NULL
        ");
    }

    public function down(): void
    {
        // Set doctor_id back to null for rollback
        DB::statement("UPDATE appointments SET doctor_id = NULL");
    }
};