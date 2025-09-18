<?php

namespace App\Http\Controllers;

use App\Models\ChatMember;
use Illuminate\Http\Request;

class ChatMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $data = ChatMember::select([
            "*",

        ])
            ->search([
                'search' => $request->search,
                'rawFields' => []
            ])
            ->with([
                'chat',
                'profile.user',
                'profile.attachments'
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ChatMember $chatMember) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatMember $chatMember)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatMember $chatMember)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatMember $chatMember)
    {
        //
    }
}