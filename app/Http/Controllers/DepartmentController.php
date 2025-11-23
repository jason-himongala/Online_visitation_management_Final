<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {

        $data = Department::select([
            "*",

        ])
            ->search([
                'search' => $request->search,
                'rawFields' => []
            ])
            ->filter($request)
            ->sortable($request)
            ->trashState($request->isTrash)
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
            "message" => "Data not " . ($request->id ? "update" : "save"),
        ];

        $data = $request->validate([
            "department_name" => "required",

        ]);



        try {
            DB::transaction(function () use ($request, $data, &$ret) {
                $query = Department::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $data
                );

                if ($query) {
                    $ret = [
                        "success" => true,
                        "message" => "Data " . ($request->id ? "updated" : "saved") . " successfully",
                    ];
                }
            });
        } catch (\Throwable $th) {
            //throw $th;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }

        return response()->json($ret, 200);
    }


    public function show(Department $department)
    {
        //
    }

    public function update(Request $request, Department $department)
    {
        //
    }

    public function destroy(Department $department)
    {
        //
    }

    public function department_archive(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data failed to " . ($request->isTrash ? "restore" : "archive")
        ];

        if ($request->ids && count($request->ids) > 0) {
            if ($request->isTrash) {
                // Restore the soft deleted records
                Department::whereIn("id", $request->ids)->restore();
                // Update the 'updated_by' field
                // $data = [
                //     "deleted_by" => null,
                //     "updated_by" => 1,
                // ];
                // Department::whereIn("id", $request->ids)->update($data);
            } else {
                $data = [
                    "deleted_at" => now(),
                    // "deleted_by" => 1,
                ];
                Department::whereIn("id", $request->ids)->update($data);
            }

            $ret = [
                "success" => true,
                "message" => "Data " . ($request->isTrash ? "restored" : "archived") . " successfully"
            ];
        }

        return response()->json($ret, 200);
    }
}
