<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatMember;
use App\Models\Department;
use App\Models\Profile;
use App\Models\User;
use App\Models\VisitaionInformation;
use App\Models\VisitorRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VisitorRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $data = VisitorRequest::select([
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
        $dataValidated = $request->validate([
            'profile_id' => 'required|array',
            'profile_id.*' => 'exists:profiles,id',
            'visitaion_information_id' => 'required|array',
            'visitaion_information_id.*' => 'exists:visitaion_information,id',
            'department_id' => 'nullable|array',
            'department_id.*' => 'nullable|integer',
        ]);

        $departmentGroups = [];

        try {
            DB::transaction(function () use ($dataValidated, $request, &$departmentGroups) {
                foreach ($dataValidated['profile_id'] as $index => $profileId) {
                    $visitationId = $dataValidated['visitaion_information_id'][$index] ?? null;
                    $remark = $request->remarks[$index] ?? null;

                    if ($visitationId) {
                        VisitorRequest::updateOrCreate(
                            ["id" => $request->id ?? null],
                            [
                                'profile_id' => $profileId,
                                'visitaion_information_id' => $visitationId,
                            ]
                        );
                        VisitaionInformation::where('id', $visitationId)
                            ->update([
                                'status' => $request->status,
                                'remarks' => $remark,
                            ]);


                        $profileWithUser = Profile::with('user')->where('id', $profileId)->first();
                        $user = $profileWithUser->user ?? null;
                        if ($user) {
                            $status = $request->status;
                            $emailTitle = $status === 'approved' ? 'Visitor Request Approved' : 'Visitor Request Declined';


                            $this->send_email([
                                "title" => $emailTitle,
                                "system_id" => 1,
                                'to_name' => $profileWithUser->firstname . ' ' . $profileWithUser->lastname,
                                "to_email" => $user->email,
                                "from_name" => "CSU Visitation System",
                                "from_email" => "no-reply@csuvisitation.com",
                            ]);
                        }

                        Log::info("Email sent to user: " . $user->email);



                        $visitationInfo = VisitaionInformation::with('appointment_schedule')
                            ->find($visitationId);

                        if ($visitationInfo && $visitationInfo->status !== 'declined') {
                            $departmentId = $visitationInfo->appointment_schedule->department_id ?? null;

                            if ($departmentId && $profileWithUser && $profileWithUser->user) {
                                $sameDepProfileIds = Profile::whereHas('user', function ($query) use ($departmentId) {
                                    $query->where('department_id', $departmentId);
                                })->pluck('id')->toArray();

                                if (!isset($departmentGroups[$departmentId])) {
                                    $departmentGroups[$departmentId] = [];
                                }

                                $departmentGroups[$departmentId][] = $profileId;

                                foreach ($sameDepProfileIds as $sameDepProfileId) {
                                    if (!in_array($sameDepProfileId, $departmentGroups[$departmentId])) {
                                        $departmentGroups[$departmentId][] = $sameDepProfileId;
                                    }
                                }
                            }
                        }
                    }
                }

                foreach ($departmentGroups as $departmentId => $profileIds) {
                    $department = Department::find($departmentId);
                    $departmentName = $department ? $department->department_name : "Unknown Department";

                    $chat = Chat::create([
                        "title_of_groupchat" => "{$departmentName} Group Chat",
                    ]);

                    foreach ($profileIds as $profileId) {
                        ChatMember::updateOrCreate(
                            [
                                "chat_id"   => $chat->id,
                                "profile_id" => $profileId,
                            ],
                            [
                                "profile_id" => $profileId,
                                "department_id" => $departmentId,
                            ]
                        );
                    }

                    $profileIdsRole3 = Profile::whereHas('user', function ($query) {
                        $query->where('user_role_id', 3);
                    })->pluck('id');

                    foreach ($profileIdsRole3 as $pid) {
                        ChatMember::updateOrCreate(
                            [
                                "chat_id"   => $chat->id,
                                "profile_id" => $pid,
                            ],
                            [
                                "profile_id" => $pid,
                                "department_id" => $departmentId,
                            ]
                        );
                    }
                }
            });

            $message = count($departmentGroups) > 0
                ? "Chat groups created and visitor requests processed successfully"
                : "Visitor requests processed successfully (no chat groups created for declined requests)";

            return response()->json([
                "success" => true,
                "message" => $message,
                "chat_groups_created" => count($departmentGroups)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => "Error: " . $th->getMessage()
            ]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(VisitorRequest $visitorRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitorRequest $visitorRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VisitorRequest $visitorRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VisitorRequest $visitorRequest)
    {
        //
    }
}
