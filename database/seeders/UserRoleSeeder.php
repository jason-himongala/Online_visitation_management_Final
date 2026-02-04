<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [

            [
                'id' => 1,
                'type' => 'Pico',
                'role' => 'Pico',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'type' => 'Department',
                'role' => 'Department',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'id' => 3,
                'type' => 'Visitor',
                'role' => 'Visitor',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'type' => 'OP',
                'role' => 'OP',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],



        ];

        UserRole::truncate();
        UserRole::insert($data);
    }
}