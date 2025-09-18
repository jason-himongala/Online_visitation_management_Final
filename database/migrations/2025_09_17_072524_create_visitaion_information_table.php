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
        Schema::create('visitaion_information', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('appointment_schedule_id')->nullable();
            $table->bigInteger('profile_id')->nullable();
            $table->longText('purpose_of_visit')->nullable();
            $table->string('status')->default('Pending');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitaion_information');
    }
};