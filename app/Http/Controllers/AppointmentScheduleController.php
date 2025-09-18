<?php

namespace App\Http\Controllers;

use App\Models\AppointmentSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentScheduleController extends Controller
{

    public function index(Request $request)
    {
        $department_name = "(SELECT department_name FROM departments WHERE id = appointment_schedules.department_id)";
        $data = AppointmentSchedule::select("appointment_schedules.*", DB::raw($department_name . " AS department_name"))
            ->with([
                "department",
            ])
            ->search([
                'search' => $request->search,
                'rawFields' => [
                    $department_name
                ]
            ])
            ->filter($request)
            ->sortable($request)
            // ->trashState($request->isTrash)
            ->pagination($request);


        $ret = [
            "success" => true,
            "data" => $data
        ];
        return response()->json($ret, 200);
    }

    public function store(Request $request)
    {

        $ret = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "updated" : "saved")
        ];

        $dataAppointmentSchedule = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'appointment_type' => 'required|string|max:255',
            'available_time' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        try {
            DB::transaction(function () use ($dataAppointmentSchedule,  &$ret, $request) {
                AppointmentSchedule::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataAppointmentSchedule
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
};