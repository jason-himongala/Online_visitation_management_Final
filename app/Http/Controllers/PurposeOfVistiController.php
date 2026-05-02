<?php

namespace App\Http\Controllers;

use App\Models\PurposeOfVisti;
use Illuminate\Http\Request;

class PurposeOfVistiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
       public function index(Request $request)
    {
       
    
        $data = PurposeOfVisti::select([
            '*',
    
        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'purpose_of_visit',
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
    public function show(PurposeOfVisti $purposeOfVisti)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurposeOfVisti $purposeOfVisti)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurposeOfVisti $purposeOfVisti)
    {
        //
    }
}