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
        $data = Contact::select([
            "*",
            DB::raw("({$username}) as username"),
            DB::raw("({$email}) as email"),
            DB::raw("({$status}) as status"),
        ])
            ->search([
                'search' => $request->search,
                'rawFields' => [
                    'username',
                    'email',
                    'message',
                ]
            ])
            ->filter($request)
            ->sortable($request)
            ->pagination($request);


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
                $query = Contact::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $data
                );

                if ($query) {
                    $ret = [
                        "success" => true,
                        "message" => "Data " . ($request->id ? "updated" : "saved") . " successfully",
                    ];
                }
            });
        } catch (\Throwable $th) {
            //throw $th;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }

        return response()->json($ret, 200);
    }
}
