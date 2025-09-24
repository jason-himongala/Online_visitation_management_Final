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
        Schema::create('visitation_forms', function (Blueprint $table) {
            $table->id();





            $table->string('user_id')->nullable();
            $table->string('purpose_of_visit')->nullable();
            $table->string('selected_faculty_centered_office_organization_to_visit')->nullable();
            $table->string('manner_of_engagement')->nullable();
            $table->string('name_of_institution_agency')->nullable();
            $table->string('name_and_contact_details_of_the_contact_person')->nullable();
            $table->string('number_of_delegates')->nullable();
            $table->string('topics_for_discussion')->nullable();
            $table->string('other_information_concern')->nullable();
            $table->date('preferred_date_of_visit')->nullable();
            $table->time('preferred_time_of_visit')->nullable();
            $table->date('alternate_date_of_visit')->nullable();
            $table->time('alternate_time_of_visit')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitation_forms');
    }
};
