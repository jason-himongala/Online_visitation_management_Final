<?php

namespace App\Http\Controllers;

use App\Exports\VisitationInformationExport;

use App\Models\UserNotification;
use App\Models\VisitaionInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class VisitaionInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $email = 'SELECT email FROM users WHERE id = (SELECT user_id FROM profiles WHERE id = visitaion_information.profile_id)';
        $available_time = "(SELECT CONCAT(DATE_FORMAT(date, '%M %d, %Y'), ' - ', available_time) FROM appointment_schedules WHERE id = visitaion_information.appointment_schedule_id)";
        $query = VisitaionInformation::query()
            ->with(['profile', 'appointment_schedule', 'profile.user', 'appointment_schedule.department'])
            ->select([
                'visitaion_information.*',
                DB::raw("($email) AS email"),
                DB::raw("($available_time) AS available_time"),
            ])
            ->leftJoin('profiles', 'profiles.id', '=', 'visitaion_information.profile_id');

        if ($request->has('user_id')) {
            $query->where('profiles.user_id', $request->user_id);
        }

        $data = $query
            ->search([
                'search' => $request->search,
                'rawFields' => [
                    "($email)",
                    "($available_time)",
                ]
            ])
            ->filter($request)
            ->sortable($request)
            ->pagination($request);

        $ret = [
            "success" => true,
            "data" => $data
        ];
        return response()->json($ret, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $ret = [
            "success" => true,
            "message" => "Visitation Information created successfully."
        ];

        $request->validate([
            'profile_id' => 'required|exists:profiles,id',
            'purpose_of_visit' => 'required|string|max:255',
            'appointments' => 'required|array|min:1',
            'appointments.*.appointment_schedule_id' => 'required|exists:appointment_schedules,id',
            'appointments.*.department_id' => 'nullable|exists:departments,id',
            'appointments.*.date' => 'nullable|date',
            'appointments.*.time' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($request, &$ret) {
                $createdVisitations = [];

                foreach ($request->appointments as $appointment) {
                    $visitation = VisitaionInformation::create([
                        'profile_id' => $request->profile_id,
                        'remarks' => $request->remarks,
                        'appointment_schedule_id' => $appointment['appointment_schedule_id'],
                        'purpose_of_visit' => $request->purpose_of_visit,
                    ]);

                    UserNotification::create([
                        "user_id" => 1, // Or get from auth
                        "visitation_information_id" => $visitation->id,
                        "read" => false,
                        "status" => true,
                    ]);

                    $createdVisitations[] = $visitation;
                }

                $ret['success'] = true;
                $ret['message'] = "Successfully created " . count($createdVisitations) . " visitation(s)";
                $ret['data'] = $createdVisitations;
            });
        } catch (\Throwable $th) {
            $ret['success'] = false;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }

        return response()->json($ret, $ret['success'] ? 200 : 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VisitaionInformation $visitaionInformation)
    {
        //
    }

    public function export_visitation_information(Request $request)
    {
        // Validate based on parameters provided
        if ($request->has('start_year') && $request->has('start_month')) {
            // Range export validation
            $request->validate([
                'start_year' => 'required|integer|min:2000|max:' . date('Y'),
                'start_month' => 'required|integer|min:1|max:12',
                'end_year' => 'required_with:end_month|integer|min:2000|max:' . date('Y'),
                'end_month' => 'required_with:end_year|integer|min:1|max:12',
            ]);

            $startYear = $request->input('start_year');
            $startMonth = $request->input('start_month');
            $endYear = $request->input('end_year', $startYear);
            $endMonth = $request->input('end_month', $startMonth);

            // Create date objects
            $startDate = Carbon::create($startYear, $startMonth, 1)->startOfMonth();
            $endDate = Carbon::create($endYear, $endMonth, 1)->endOfMonth();

            // Validate date range
            if ($endDate->lt($startDate)) {
                return response()->json([
                    'error' => 'End date must be after start date'
                ], 422);
            }

            // Format months
            $startMonthFormatted = str_pad($startMonth, 2, '0', STR_PAD_LEFT);
            $endMonthFormatted = str_pad($endMonth, 2, '0', STR_PAD_LEFT);

            // Create filename
            if ($startYear == $endYear && $startMonth == $endMonth) {
                // Single month
                $fileName = "visitations_{$startYear}_{$startMonthFormatted}.xlsx";
            } else {
                // Range
                $fileName = "visitations_{$startYear}_{$startMonthFormatted}_to_{$endYear}_{$endMonthFormatted}.xlsx";
            }

            return Excel::download(
                new VisitationInformationExport($startYear, $startMonth, $endYear, $endMonth),
                $fileName
            );
        } else {
            // Single month export validation
            $request->validate([
                'year' => 'required|integer|min:2000|max:' . date('Y'),
                'month' => 'required|integer|min:1|max:12',
            ]);

            $year = $request->input('year');
            $month = $request->input('month');

            // Format month
            $monthFormatted = str_pad($month, 2, '0', STR_PAD_LEFT);

            // Create filename
            $fileName = "visitations_{$year}_{$monthFormatted}.xlsx";

            return Excel::download(
                new VisitationInformationExport($year, $month, $year, $month),
                $fileName
            );
        }
    }
}
