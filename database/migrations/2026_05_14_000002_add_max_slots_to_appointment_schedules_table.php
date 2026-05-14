<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment_schedules', function (Blueprint $table) {
            // Maximum number of concurrent bookings allowed per time slot
            // Default 1 means only one visitor can book each hour
            $table->integer('max_slots')->default(1)->after('available_time');
        });
    }

    public function down(): void
    {
        Schema::table('appointment_schedules', function (Blueprint $table) {
            $table->dropColumn('max_slots');
        });
    }
};
