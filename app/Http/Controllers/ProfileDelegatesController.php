<?php

namespace App\Http\Controllers;

use App\Models\ProfileDelegates;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileDelegatesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $fullname = $this->fullname;

        $data = ProfileDelegates::select([
            '*',
            DB::raw("($fullname) AS fullname"),
        ])
            ->search([
                'search' => $request->search,
                'rawFields' => [
                    "($fullname)",

                ]
            ])
            ->with(['visitation_forms'])
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProfileDelegates $profileDelegates)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProfileDelegates $profileDelegates)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProfileDelegates $profileDelegates)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProfileDelegates $profileDelegates)
    {
        //
    }

    public function generate_visitation_certificates(Request $request)
    {
        $visitation_information_id = $request->visitation_information_id;
        $fullname = $this->fullname;

        $data = ProfileDelegates::with(['visitation_forms'])
            ->where('visitation_form_id', $visitation_information_id)
            ->select([
                '*',
                DB::raw("($fullname) AS fullname"),
            ])
            ->get();

        $csu_logo = base64_encode(file_get_contents(public_path("images/logo.png")));
        $csu_logo = 'data:image/png;base64,' . $csu_logo;
        $bagong_pillipinas_logo = base64_encode(file_get_contents(public_path("images/bagong_pillipinas_logo.jpg")));
        $bagong_pillipinas_logo = 'data:image/png;base64,' . $bagong_pillipinas_logo;

        $pdf = Pdf::loadView('pdf.pdf-cer-template', [
            'data' => $data,
            'csu_logo' => $csu_logo,
            'bagong_pillipinas_logo' => $bagong_pillipinas_logo
        ]);

        $pdf->getDomPDF()->setHttpContext(
            stream_context_create([
                'ssl' => [
                    'allow_self_signed' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ])
        );

        $pdf->setPaper('A4', 'portrait');
        return $pdf->stream();
    }
}