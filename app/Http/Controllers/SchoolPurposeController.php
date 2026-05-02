<?php

namespace App\Http\Controllers;

use App\Models\SchoolPurpose;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;



class SchoolPurposeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       

        $data = SchoolPurpose::select([
            '*',
    
        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'school_purpose',
                ],
                'rawFields' => [
                 
                ]
            ])
            ->filter($request)
            ->trashState($request->isTrash)
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolPurpose $schoolPurpose)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SchoolPurpose $schoolPurpose)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolPurpose $schoolPurpose)
    {
        //
    }
}