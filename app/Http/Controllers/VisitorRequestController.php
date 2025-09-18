<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatMember;
use App\Models\Profile;
use App\Models\VisitaionInformation;
use App\Models\VisitorRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


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
        ]);





        try {
            DB::transaction(function () use ($dataValidated, $request) {
                $chat = Chat::updateOrCreate(
                    ["id" => $request->id ?? null],
                    ["title_of_groupchat" => $request->title_of_groupchat ?? 'Group Chat']
                );

                foreach ($dataValidated['profile_id'] as $profileId) {
                    ChatMember::updateOrCreate(
                        [
                            "chat_id"   => $chat->id,
                            "profile_id" => $profileId,
                        ],
                        [
                            "profile_id" => $profileId
                        ]
                    );
                }

                $profileIdsRole3 = Profile::whereHas('user', function ($query) {
                    $query->where('user_role_id', [2, 3]);
                })->pluck('id');

                foreach ($profileIdsRole3 as $pid) {
                    ChatMember::updateOrCreate(
                        [
                            "chat_id"   => $chat->id,
                            "profile_id" => $pid,
                        ],
                        [
                            "profile_id" => $pid
                        ]
                    );
                }

                foreach ($dataValidated['profile_id'] as $index => $profileId) {
                    $visitationId = $dataValidated['visitaion_information_id'][$index] ?? null;

                    if ($visitationId) {
                        VisitorRequest::updateOrCreate(
                            ["id" => $request->id ?? null],
                            [
                                'profile_id' => $profileId,
                                'visitaion_information_id' => $visitationId,
                            ]
                        );

                        VisitaionInformation::where('id', $visitationId)
                            ->update(['status' => $request->status ?? '']);
                    }
                }
            });

            return response()->json([
                "success" => true,
                "message" => "Chat, members, and visitor requests saved successfully"
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