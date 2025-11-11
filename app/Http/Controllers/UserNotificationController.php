<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(created_at, '%m/%d/%Y')";
        $data = UserNotification::select([
            '*',

        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'lrn'
                ],
                'rawFields' => [
                    $created_at_format

                ]
            ])
            ->with(['visitaion_information.appointment_schedule', 'visitaion_information.profile', 'visitaion_information.appointment_schedule.department',])
            ->filter($request)
            ->sortable($request)
            ->pagination($request);

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'read' => 'required|boolean',
        ]);


        try {
            DB::transaction(function () use ($data, &$ret, $request) {
                UserNotification::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $data
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
    public function show(UserNotification $userNotification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserNotification $userNotification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserNotification $userNotification)
    {
        //
    }
}
