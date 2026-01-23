<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileAddress;
use App\Models\ProfileGuardian;
use App\Models\ProfileNativeLanguage;
use App\Models\ProfileOtherCredencialPresented;
use App\Models\ProfileSchoolAttended;
use App\Models\User;
use App\Models\UserRole;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;



class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $fullname = $this->fullname;
        $created_at_format = "DATE_FORMAT(created_at, '%m/%d/%Y')";
        $birthdate_formatted = "DATE_FORMAT(birthdate, '%m/%d/%Y')";

        $data = Profile::select([
            '*',
            DB::raw("$fullname as fullname"),
            DB::raw("$created_at_format as created_at_format"),
            DB::raw("$birthdate_formatted as birthdate_formatted")
        ])
            ->search([
                'search' => $request->search,
                'fields' => [
                    'lrn'
                ],
                'rawFields' => [
                    $fullname,
                    $created_at_format,
                    $birthdate_formatted
                ]
            ])
            ->filter($request)
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
    public function profiles_signup(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "updated" : "saved")
        ];


        $dataUser  =  $request->validate([
            'email' => [
                'required',
                Rule::unique('users')->ignore($request->id),
            ],
            'username' => [
                'required',
                Rule::unique('users')->ignore($request->id),
            ],
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        $dataProfile = $request->validate([

            "firstname" => 'required',
            "middlename" => 'nullable',
            "lastname" => 'required',

        ]);



        try {
            DB::transaction(function () use ($dataProfile, &$ret, $request, $dataUser) {
                if ($request->id) {
                    $dataProfile['updated_by'] = auth()->id();
                } else {
                    $dataProfile['created_by'] = auth()->id();
                }

                $VisitorUserRole = UserRole::where('role', 'Visitor')->first();
                $dataUser['status'] = 'Active';

                $dataUser['user_role_id'] = $VisitorUserRole->id;
                $user = User::updateOrCreate(
                    ['id' => $request->id ?? null],
                    $dataUser
                );


                $dataProfile['user_id'] = $user->id;
                $profile = Profile::updateOrCreate(
                    ["id" => $request->id ?? null],
                    $dataProfile
                );


                if ($request->hasFile('profile_picture')) {
                    $this->create_attachment($profile, $request->file('profile_picture'), [
                        "folder_name" => "profiles/profile-$profile->id/profile_picture",
                        "file_description" => "Profile Picture",
                    ]);
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
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Profile::with([
            'user',
            'attachments' => function ($query) {
                $query->orderBy('id', 'desc');
            },
        ])
            ->find($id);

        return response()->json([
            'success'   => true,
            'data'      => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $ret = [
            "success" => false,
            "message" => "Data not updated",
            "request" => $request->all(),
        ];

        return response()->json($ret, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function destroy(Profile $profile)
    {
        $ret = [
            "success" => false,
            "message" => "Data not deleted",
        ];

        if ($profile) {
            $profile->deleted_by = Auth::id();
            $profile->save();
            $profile->delete();

            $ret = [
                "success" => true,
                "message" => "Data deleted successfully",
            ];
        }

        return response()->json($ret, 200);
    }

    public function profile_student_enrolled_status(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not updated",
        ];

        $profile = Profile::find($request->id);
        if ($profile) {
            $profile->status = $request->status;
            $profile->save();

            $ret = [
                "success" => true,
                "message" => "Data Updated successfully",
            ];
        }

        return response()->json($ret, 200);
    }




    public function update_profile_photo(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Profile photo not updated",
        ];

        $request->validate([
            'profile_id' => ['required'],
            'profile_picture' => ['required', 'mimes:jpg,jpeg,png'],
        ]);

        $findProfile = Profile::find($request->profile_id);

        if ($findProfile) {
            if ($request->hasFile("profile_picture")) {
                $file = $request->file("profile_picture");

                $this->create_attachment($findProfile, $file, [
                    'folder_name' => "profiles/profile-$findProfile->id/profile_picture",
                    'file_description' => "Profile Picture",
                ]);

                $ret = [
                    "success" => true,
                    "message" => "Profile photo updated successfully",
                ];
            }
        }

        return response()->json($ret, 200);
    }
}