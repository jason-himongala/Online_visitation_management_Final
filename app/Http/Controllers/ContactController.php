<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $username = "SELECT username FROM users WHERE id=contacts.user_id LIMIT 1";
        $email = "SELECT email FROM users WHERE id=contacts.user_id LIMIT 1";
        $status = "SELECT status FROM users WHERE id=contacts.user_id LIMIT 1";

        $sub = Contact::selectRaw('MAX(id) as id')->groupBy('user_id');
        $data = Contact::select([
            "*",
            DB::raw("({$username}) as username"),
            DB::raw("({$email}) as email"),
            DB::raw("({$status}) as status"),
        ])
            ->whereIn('id', $sub)
            ->orderBy('id', 'desc')
            ->get();

        $ret = [
            "success" => true,
            "data" => $data
        ];
        return response()->json($ret, 200);
    }


    public function submit_contact(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "update" : "save"),
        ];

        $data = $request->validate([
            "user_id" => "nullable",
            "message" => "required",

        ]);



        try {
            DB::transaction(function () use ($request, $data, &$ret) {
                if ($request->id) {
                    $contact = Contact::find($request->id);
                    if ($contact) {
                        $contact->user_id = $data['user_id'] ?? null;
                        $contact->save();
                        $ret = [
                            "success" => true,
                            "message" => "User ID updated successfully",
                        ];
                    } else {
                        $ret = [
                            "success" => false,
                            "message" => "Contact not found",
                        ];
                    }
                } else {
                    $contact = Contact::create([
                        'user_id' => $data['user_id'] ?? null,
                        'message' => $data['message'],
                    ]);
                    $ret = [
                        "success" => true,
                        "message" => "Contact created successfully",
                    ];
                }
            });
        } catch (\Throwable $th) {
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }
        return response()->json($ret, 200);
    }
}
