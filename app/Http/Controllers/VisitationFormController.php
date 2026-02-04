<?php

namespace App\Http\Controllers;

use App\Models\ProfileDelegates;
use App\Models\VisitationForm;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitationFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {


        $created_at_formatted = "DATE_FORMAT(created_at, '%y-%m-%d')";


        $data = VisitationForm::select([
            '*',
            DB::raw("$created_at_formatted as created_at_formatted")
        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'purpose_of_visit',
                    'name_of_institution_agency',
                    'topics_for_discussion',
                    'other_information_concern',
                    'preferred_date_of_visit',
                    'preferred_time_of_visit',
                    'alternate_date_of_visit',
                    'alternate_time_of_visit',
                    'created_at',
                ],

            ])
            ->with(['visitation_information.profile', 'profile_delegate'])
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

        $dataProfileVisitationForm = $request->validate([
            'user_id' => 'nullable',
            'visitation_information_id' => 'nullable',
            'purpose_of_visit' => 'required',
            'selected_faculty_centered_office_organization_to_visit' => 'nullable',
            'manner_of_engagement' => 'required',
            'name_of_institution_agency' => 'required',
            'topics_for_discussion' => 'required',
            'other_information_concern' => 'required',
            'preferred_date_of_visit' => 'required|date',
            'preferred_time_of_visit' => 'required',
            'alternate_date_of_visit' => 'required|date',
            'alternate_time_of_visit' => 'required',
            'remarks' => 'nullable',
        ]);

        $dataProfileDelegates = $request->input('profile_delegates');

        try {
            DB::transaction(function () use (
                $dataProfileVisitationForm,
                &$ret,
                $request,
                $dataProfileDelegates
            ) {
                $profileVisitationForm = VisitationForm::updateOrCreate(
                    ['id' => $request->id ?? null],
                    $dataProfileVisitationForm
                );

                $visitationInformationId = $profileVisitationForm->visitation_information_id
                    ?? $dataProfileVisitationForm['visitation_information_id']
                    ?? null;

                if ($request->id && $visitationInformationId) {
                    $vi = \App\Models\VisitaionInformation::find($visitationInformationId);
                    if ($vi && strtolower($vi->status) === 'approved') {
                        $vi->update(['remarks' => 'Completed']);
                    }
                }

                $profileVisitationFormId = $profileVisitationForm->id;

                if ($dataProfileDelegates) {
                    if (is_string($dataProfileDelegates)) {
                        $dataProfileDelegates = json_decode($dataProfileDelegates, true);
                    }

                    if (is_array($dataProfileDelegates)) {
                        $keepIds = [];

                        foreach ($dataProfileDelegates as $delegates) {
                            $delegates['visitation_form_id'] = $profileVisitationFormId;

                            $record = ProfileDelegates::updateOrCreate(
                                ['id' => $delegates['id'] ?? null],
                                $delegates
                            );

                            $keepIds[] = $record->id;
                        }

                        ProfileDelegates::where('visitation_form_id', $profileVisitationFormId)
                            ->whereNotIn('id', $keepIds)
                            ->delete();
                    }
                }
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
    public function show(VisitationForm $visitationForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitationForm $visitationForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VisitationForm $visitationForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VisitationForm $visitationForm)
    {
        //
    }
}