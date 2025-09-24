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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('visitation_information_id')->nullable();
            $table->date('date')->nullable();
            $table->longText('cc1_checkbox')->nullable();
            $table->longText('cc2_checkbox')->nullable();
            $table->longText('cc3_checkbox')->nullable();
            $table->string('client_type')->nullable();
            $table->string('gender')->nullable();
            $table->string('age')->nullable();
            $table->string('region_of_residences')->nullable();
            $table->string('offices_person_visited')->nullable();
            $table->string('other_info_concerns')->nullable();
            $table->string('suggestions')->nullable();
            $table->string('email_address')->nullable();
            $table->string('answer_1')->nullable();
            $table->string('answer_2')->nullable();
            $table->string('answer_3')->nullable();
            $table->string('answer_4')->nullable();
            $table->string('answer_5')->nullable();
            $table->string('answer_6')->nullable();



            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};