<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

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
        //
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
}