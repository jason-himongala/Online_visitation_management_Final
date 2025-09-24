<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $created_at_formatted = "DATE_FORMAT(created_at, '%y-%m-%d')";


        $data = Feedback::select([
            '*',
            DB::raw("$created_at_formatted as created_at_formatted")
        ])
            ->search([
                'search' => $request->search,
                'fields' => [],

            ])
            ->with(['visitation_information.profile'])
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
            "success" => false,
            "message" => "Data not " . ($request->id ? "updated" : "saved")
        ];


        $dataFeedback = $request->validate([
            'user_id' => 'exists:users,id',
            'visitation_information_id' => 'nullable',
            'client_type' => 'required|string',
            'gender' => 'required|string',
            'age' => 'required|integer',
            'region_of_residences' => 'required|string',
            'offices_person_visited' => 'required|string',
            'other_info_concerns' => 'required|string',
            'suggestions' => 'required|string',
            'email_address' => 'required|string',
            'answer_1' => 'required|string',
            'answer_2' => 'required|string',
            'answer_3' => 'required|string',
            'answer_4' => 'required|string',
            'answer_5' => 'required|string',
            'answer_6' => 'required|string',
            'date' => 'required|date',
            'cc1_checkbox' => 'required|string',
            'cc2_checkbox' => 'required|string',
            'cc3_checkbox' => 'required|string',
        ]);


        try {
            DB::transaction(function () use ($request, &$ret, $dataFeedback) {


                Feedback::updateOrCreate(
                    ['id' => $request->id],
                    $dataFeedback
                );

                $ret['success'] = true;
                $ret['message'] = "Data " . ($request->id ? "updated" : "saved") . " successfully";
            });
        } catch (\Exception $e) {
            $ret["message"] = "Error: " . $e->getMessage();
        }

        return response()->json($ret);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        //
    }
}