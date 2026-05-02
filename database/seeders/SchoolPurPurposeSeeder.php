<?php

namespace Database\Seeders;

use App\Models\SchoolPurpose;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolPurPurposeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'school_purpose' => 'Academic Transaction',
                'description' => ''

            ],
            [
                'school_purpose' => 'Administrative / Office Transaction',
                'description' => ''

            ],
            [
                'school_purpose' => 'Parent / Guardian Visit',
                'description' => ''

            ],
            [
                'school_purpose' => 'Industry / Partnership Visit',
                'description' => ''

            ],
            [
                'school_purpose' => 'Visit',
                'description' => ''

            ],
            [
                'school_purpose' => 'Official / Government Visit',
                'description' => ''

            ],


        ];
        SchoolPurpose::truncate();
        SchoolPurpose::insert($data);
    }
}
