<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $created_at_formatted = "DATE_FORMAT(created_at, '%m/%d/%Y')";
        $data = UserRole::select([
            'user_roles.*',
            DB::raw($created_at_formatted . ' AS created_at_formatted'),
        ])
            ->search([
                'search' => $request->search,
                'field' => ['role', 'type'],
                'rawFields' => [
                    $created_at_formatted
                ]
            ])
            ->filter($request)
            ->sortable($request)
            ->trashState($request->isTrash)
            ->pagination($request);


        $ret = [
            'success' => true,
            'data' => $data,
        ];

        return response()->json($ret, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "update" : "saved")
        ];
        $data = $request->validate([
            'type' => 'required|string|max:255',
            'role' => 'required|string|max:255',
        ]);



        if ($request->id) {
            $data += [
                "updated_by" => auth()->user()->id
            ];
        } else {
            $data += [
                "created_by" => auth()->user()->id
            ];
        }


        try {
            DB::transaction(function () use ($request, $data, &$ret) {
                $query = UserRole::updateOrCreate(
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

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UserRole  $userRole
     * @return \Illuminate\Http\Response
     */
    public function show(UserRole $userRole)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserRole  $userRole
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserRole $userRole)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserRole  $userRole
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not delete"
        ];

        $find = UserRole::find($id);

        if ($find) {
            if ($find->delete()) {
                $ret  = [
                    "success" => true,
                    "message" => "Data deleted successfully"
                ];
            }
        }

        return response()->json($ret, 200);
    }


    public function user_role_archive(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data failed to " . ($request->isTrash ? "restore" : "archive")
        ];

        if ($request->ids && count($request->ids) > 0) {
            if ($request->isTrash) {
                // Restore the soft deleted records
                UserRole::whereIn("id", $request->ids)->restore();
                // Update the 'updated_by' field
                $data = [
                    "deleted_by" => null,
                    "updated_by" => auth()->id(),
                ];
                UserRole::whereIn("id", $request->ids)->update($data);
            } else {
                $data = [
                    "deleted_at" => now(),
                    "deleted_by" => auth()->id(),
                ];
                UserRole::whereIn("id", $request->ids)->update($data);
            }

            $ret = [
                "success" => true,
                "message" => "Data " . ($request->isTrash ? "restored" : "archived") . " successfully"
            ];
        }

        return response()->json($ret, 200);
    }
}