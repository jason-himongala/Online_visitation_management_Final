<?php

namespace Database\Seeders;

use App\Models\PurposeOfVisti;
use Illuminate\Database\Seeder;

class PurposeOfVisitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Academic Transaction
            [
                'school_purpose_id' => 1,
                'purpose_of_visit' => 'Enrollment',
            ],
            [
                'school_purpose_id' => 1,
                'purpose_of_visit' => 'Records',
            ],
            [
                'school_purpose_id' => 1,
                'purpose_of_visit' => 'Transcripts',
            ],
            [
                'school_purpose_id' => 1,
                'purpose_of_visit' => 'Scholarships',
            ],
            [
                'school_purpose_id' => 1,
                'purpose_of_visit' => 'Consultations',
            ],

            // Administrative / Office Transaction
            [
                'school_purpose_id' => 2,
                'purpose_of_visit' => 'Document Submission',
            ],
            [
                'school_purpose_id' => 2,
                'purpose_of_visit' => 'Document Pick-up',
            ],
            [
                'school_purpose_id' => 2,
                'purpose_of_visit' => 'Certifications',
            ],
            [
                'school_purpose_id' => 2,
                'purpose_of_visit' => 'Billing',
            ],
            [
                'school_purpose_id' => 2,
                'purpose_of_visit' => 'Cashier',
            ],

            // Parent / Guardian Visit
            [
                'school_purpose_id' => 3,
                'purpose_of_visit' => 'Student Welfare',
            ],
            [
                'school_purpose_id' => 3,
                'purpose_of_visit' => 'Financial Concerns',
            ],
            [
                'school_purpose_id' => 3,
                'purpose_of_visit' => 'Faculty Meetings',
            ],

            // Campus Tour / General Inquiry
            [
                'school_purpose_id' => 4,
                'purpose_of_visit' => 'Prospective Students',
            ],
            [
                'school_purpose_id' => 4,
                'purpose_of_visit' => 'General Information',
            ],
            [
                'school_purpose_id' => 4,
                'purpose_of_visit' => 'Media Visits',
            ],

            // Industry / Partnership Visit
            [
                'school_purpose_id' => 5,
                'purpose_of_visit' => 'MOA Signing',
            ],
            [
                'school_purpose_id' => 5,
                'purpose_of_visit' => 'OJT Coordination',
            ],
            [
                'school_purpose_id' => 5,
                'purpose_of_visit' => 'Research Collaboration',
            ],

            // Research & Extension Visit
            [
                'school_purpose_id' => 6,
                'purpose_of_visit' => 'Lab Visits',
            ],
            [
                'school_purpose_id' => 6,
                'purpose_of_visit' => 'Data Collection',
            ],
            [
                'school_purpose_id' => 6,
                'purpose_of_visit' => 'Community Programs',
            ],
            [
                'school_purpose_id' => 6,
                'purpose_of_visit' => 'Project Monitoring',
            ],

            // Delivery / Maintenance
            [
                'school_purpose_id' => 7,
                'purpose_of_visit' => 'Supplies Delivery',
            ],
            [
                'school_purpose_id' => 7,
                'purpose_of_visit' => 'Equipment Delivery',
            ],
            [
                'school_purpose_id' => 7,
                'purpose_of_visit' => 'Repair',
            ],
            [
                'school_purpose_id' => 7,
                'purpose_of_visit' => 'IT Support',
            ],

            // Official / Government Visit
            [
                'school_purpose_id' => 8,
                'purpose_of_visit' => 'Audit',
            ],
            [
                'school_purpose_id' => 8,
                'purpose_of_visit' => 'Accreditation',
            ],
            [
                'school_purpose_id' => 8,
                'purpose_of_visit' => 'Inter-agency Coordination',
            ],
        ];

        PurposeOfVisti::truncate();
        PurposeOfVisti::insert($data);
    }
}
