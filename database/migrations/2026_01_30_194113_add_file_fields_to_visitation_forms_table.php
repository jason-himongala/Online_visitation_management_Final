<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('visitation_forms', function (Blueprint $table) {
            if (!Schema::hasColumn('visitation_forms', 'file_path')) {
                $table->string('file_path')->nullable()->after('other_information_concern');
            }
            if (!Schema::hasColumn('visitation_forms', 'file_name')) {
                $table->string('file_name')->nullable()->after('file_path');
            }
            if (!Schema::hasColumn('visitation_forms', 'file_size')) {
                $table->integer('file_size')->nullable()->after('file_name');
            }
            if (!Schema::hasColumn('visitation_forms', 'file_type')) {
                $table->string('file_type')->nullable()->after('file_size');
            }
        });
    }

    public function down()
    {
        Schema::table('visitation_forms', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_name', 'file_size', 'file_type']);
        });
    }
};