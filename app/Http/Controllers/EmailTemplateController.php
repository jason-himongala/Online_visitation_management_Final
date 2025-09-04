<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(created_at, '%m/%d/%Y')";

        $data = EmailTemplate::select([
            'id',
            'title',
            'subject',
            'body',
            DB::raw($created_at_format . ' as created_at_format')
        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'title',
                    'page_module',
                    'content',
                ],
                'rawFields' => [
                    $created_at_format,
                ],
            ])
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
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data failed to " . ($request->id ? "update" : "create") . "."
        ];

        $data = $request->validate([
            "title" => "required|unique:email_templates,title," . $request->id,
            "subject" => "required",
            "body" => "required",
        ]);

        try {
            DB::transaction(function () use ($data, $request, &$ret) {
                $updateCreate = EmailTemplate::updateOrCreate([
                    'id' => $request->id,
                ], $data);

                if ($updateCreate->wasRecentlyCreated) {
                    $updateCreate->created_by = auth()->id();
                } else {
                    $updateCreate->updated_by = auth()->id();
                }

                $updateCreate->save();

                $ret["success"] = true;
                $ret["message"] = "Data " . ($request->id ? "updated" : "created") . " successfully.";
            });
        } catch (\Throwable $th) {
            //throw $th;
            $ret["message"] = "An error occurred: " . $th->getMessage();
        }

        return response()->json($ret, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EmailTemplate  $emailTemplate
     * @return \Illuminate\Http\Response
     */
    public function show(EmailTemplate $emailTemplate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EmailTemplate  $emailTemplate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EmailTemplate  $emailTemplate
     * @return \Illuminate\Http\Response
     */
    public function destroy(EmailTemplate $emailTemplate)
    {
        //
    }
}