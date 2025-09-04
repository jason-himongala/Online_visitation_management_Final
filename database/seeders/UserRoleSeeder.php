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
                'type' => 'Super Admin',
                'role' => 'Super Admin',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],



        ];
        UserRole::truncate();
        UserRole::insert($data);
    }
}
