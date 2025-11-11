<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {


        $data = Chat::select([
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
            'success' => true,
            'data' => $data,
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

    $data = $request->validate([
        'title_of_groupchat' => 'required|string|max:255',
        'id' => 'nullable|integer|exists:chats,id'
    ]);

    try {
        $chat = Chat::updateOrCreate(
            ['id' => $request->id],
            ['title_of_groupchat' => $data['title_of_groupchat']]
        );

        $ret['success'] = true;
        $ret['message'] = 'Data successfully ' . ($request->id ? 'updated' : 'saved');
        $ret['data'] = $chat;
    } catch (\Exception $e) {
        $ret['message'] = $e->getMessage();
    }

    return response()->json($ret, 200);
}
    /**
     * Display the specified resource.
     */
    public function show(Chat $chat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chat $chat)
    {
        //
    }
}