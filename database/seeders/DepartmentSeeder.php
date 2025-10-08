<?php

namespace Database\Seeders;

use App\Models\Deparment;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['department_name' => 'College of Humanities and Social Sciences'],
            ['department_name' => 'College of Agriculture and Agri-Industries'],
            ['department_name' => 'College of Forestry and Environmental Sciences'],
            ['department_name' => 'College of Mathematics and Natural Sciences'],
            ['department_name' => 'College of Computing and Information Sciences'],
            ['department_name' => 'College of Engineering and Geo-Sciences'],
            ['department_name' => 'College of Education'],
        ];

        Department::truncate();
        Department::insert($data);
    }
}