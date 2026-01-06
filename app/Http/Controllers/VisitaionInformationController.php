<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Profile;
use App\Models\User;
use App\Models\UserNotification;
use App\Models\VisitaionInformation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use phpseclib3\File\ASN1\Maps\UserNotice;

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
}