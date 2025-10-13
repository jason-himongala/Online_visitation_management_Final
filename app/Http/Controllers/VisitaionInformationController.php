<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Profile;
use App\Models\VisitaionInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitaionInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $email = 'SELECT email FROM users WHERE id = (SELECT user_id FROM profiles WHERE id = visitaion_information.profile_id)';
        $available_time = 'SELECT available_time FROM appointment_schedules WHERE id = visitaion_information.appointment_schedule_id';

        $query = VisitaionInformation::query()
            ->with(['profile'])
            ->select([
                'visitaion_information.*',
                DB::raw("($email) AS email"),
                DB::raw("($available_time) AS available_time"),
            ])
            ->leftJoin('profiles', 'profiles.id', '=', 'visitaion_information.profile_id'); // <-- Add this line

        // Example: filter by user_id if provided
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
            "message" => "Visitaion Information created successfully."
        ];



        $dataValidated = $request->validate([
            // 'department_id' => 'required|exists:departments,id',
            'profile_id' => 'required|exists:profiles,id',
            'appointment_schedule_id' => 'required|exists:appointment_schedules,id',
            'purpose_of_visit' => 'required|string|max:255',

        ]);



        try {
            DB::transaction(function () use ($dataValidated,  &$ret, $request) {

                VisitaionInformation::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataValidated
                );



                $ret['success'] = true;
                $ret['message'] = "Data " . ($request->id ? "updated" : "saved") . " successfully";
            });
        } catch (\Throwable $th) {
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }

        $ret['request'] = $request->all();

        return response()->json($ret, 200);
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
