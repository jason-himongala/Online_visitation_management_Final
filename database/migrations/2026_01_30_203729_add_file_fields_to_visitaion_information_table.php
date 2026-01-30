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
        Schema::table('visitaion_information', function (Blueprint $table) {
            Schema::table('visitaion_information', function (Blueprint $table) {
                if (!Schema::hasColumn('visitaion_information', 'file_path')) {
                    $table->string('file_path')->nullable()->after('remarks');
                }
                if (!Schema::hasColumn('visitaion_information', 'file_name')) {
                    $table->string('file_name')->nullable()->after('file_path');
                }
                if (!Schema::hasColumn('visitaion_information', 'file_size')) {
                    $table->integer('file_size')->nullable()->after('file_name');
                }
                if (!Schema::hasColumn('visitaion_information', 'file_type')) {
                    $table->string('file_type')->nullable()->after('file_size');
                }
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitaion_information', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_name', 'file_size', 'file_type']);
        });
    }
};