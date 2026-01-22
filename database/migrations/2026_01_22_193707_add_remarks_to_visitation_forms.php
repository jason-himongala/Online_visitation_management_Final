<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('visitation_forms', function (Blueprint $table) {
            $table->string('remarks')->nullable()->after('alternate_time_of_visit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitation_forms', function (Blueprint $table) {
            $table->dropColumn('remarks');
        });
    }
};
