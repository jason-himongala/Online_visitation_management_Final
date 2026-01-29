<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileContactInformation;
use App\Models\ProfileDepartment;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;



class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $type = "(SELECT `type` FROM user_roles WHERE user_roles.id = users.user_role_id)";
        $department_name = "(SELECT `department_name` FROM departments WHERE departments.id = users.department_id)";
        $role = "(SELECT `role` FROM user_roles WHERE user_roles.id = users.user_role_id)";
        $fullname = "(SELECT " . $this->fullname . " FROM profiles WHERE profiles.user_id=users.id ORDER BY profiles.id LIMIT 1)";
        $created_at_formatted = "DATE_FORMAT(created_at, '%m-%d-%Y')";

        $data = User::select([
            "users.*",
            DB::raw("$type type"),
            DB::raw(value: "$role role"),
            DB::raw("$fullname fullname"),
            DB::raw("$created_at_formatted created_at_formatted"),
            DB::raw("$department_name department_name"),
        ])
            ->search([
                'search' => $request->search,
                'rawFields' => [
                    $fullname,
                    $type,
                    $role,
                    $created_at_formatted,
                    $department_name
                ]
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not " . ($request->id ? "updated" : "saved")
        ];

        $departmentRule = Rule::unique('users')->where(function ($query) use ($request) {
            return $query->where('department_id', $request->department_id);
        });

        $UserRole = Rule::unique('users')->where(function ($query) use ($request) {
            return $query->where('user_role_id', $request->user_role_id);
        });



        $department_role = 2;

        $request->validate([
            'username' => [
                'required',
                Rule::unique('users')->ignore($request->id),
            ],
            'email' => [
                'required',
                Rule::unique('users')->ignore($request->id)
            ],
            "firstname" => "required",
            "lastname" => "required",
            "department_id" => [
                'nullable',
                $departmentRule->ignore($request->id),
            ],
            'user_role_id' => [
                'required',
                Rule::when(
                    $request->user_role_id != $department_role,
                    Rule::unique('users', 'user_role_id')->ignore($request->id)
                ),
            ],
        ]);

        $data = [
            "user_role_id" => $request->user_role_id,
            "department_id" => $request->department_id,
            "username" => $request->username,
            "email" => $request->email,
            "password" => $request->password ? Hash::make($request->password) : User::find($request->id)->password,
            "status" => 'Active',
        ];

        if ($request->id) {
            $data += [
                "updated_by" => Auth::id()
            ];
        } else {
            $data += [
                "created_by" => Auth::id()
            ];
        }

        $user = User::updateOrCreate([
            "id" => $request->id,
        ], $data);

        if ($user) {
            $profile = Profile::updateOrCreate(
                ["user_id" => $user->id],
                [
                    "firstname" => $request->firstname,
                    "lastname" => $request->lastname,
                ]
            );

            if ($profile && $request->file('profile_picture')) {
                $this->create_attachment($profile, $request->file('profile_picture'), [
                    "folder_name" => "profiles/profile-$profile->id/profile_pictures",
                    "file_description" => "Profile Picture",
                ]);
            }

            $ret = [
                "success" => true,
                "message" => "Data " . ($request->id ? "updated" : "saved") . " successfully"
            ];
        }

        return response()->json($ret, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = User::with([
            "user_role",
            "profile"
        ])->find($id);

        $ret = [
            "success" => true,
            "data" => $data
        ];

        return response()->json($ret, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $ret  = [
            "success" => false,
            "message" => "Data not deleted"
        ];

        $UserDelete = User::find($id);

        if ($UserDelete) {
            $UserDelete->update(['deleted_by' => Auth::id()]);

            if ($UserDelete->delete()) {
                $ret  = [
                    "success" => true,
                    "message" => "Data deleted successfully"
                ];
            }
        }
        $ret = [
            "success" => true,
            "message" => "Data deleted successfully"
        ];

        return response()->json($ret, 200);
    }



    public function create_user($request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not created",
        ];

        $error = false;

        $usersInfo = [
            "user_role_id" => $request->user_role_id,
            "username" => $request->username,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "created_by" => Auth::id(),
            "status" => 'Active',
        ];

        $findSchoolId = Profile::firstWhere('school_id', $request->school_id);

        if ($findSchoolId) {
            if ($findSchoolId->user_id != "") {
                $error = true;

                $ret = [
                    "success" => true,
                    "message" => "School ID already exist and already taken by other user",
                ];
            }
        }

        if ($error == false) {
            $createUser = User::create($usersInfo);

            if ($createUser) {
                $dataProfile = [
                    "firstname" => $request->firstname,
                    "lastname" => $request->lastname,
                    "user_id" => $createUser->id,
                    "school_id" => $request->school_id,
                    "gender" => $request->gender,
                ];

                $profile_id = "";

                $findProfilByUserId = \App\Models\Profile::where('user_id', $createUser->id)->first();

                if ($findProfilByUserId) {
                    $profile_id = $findProfilByUserId->id;
                    $dataProfile["updated_by"] = Auth::id();
                    $findProfilByUserIdUpdate = $findProfilByUserId->fill($dataProfile);
                    $findProfilByUserIdUpdate->save();

                    if ($request->hasFile('imagefile')) {
                        $folder_name = "";

                        if ($findProfilByUserId->folder_name) {
                            $folder_name = $findProfilByUserId->folder_name;
                        } else {
                            $folder_name = Str::random(10);
                        }

                        $this->create_attachment($findProfilByUserId, $request->file('imagefile'), [
                            "folder_name" => "profiles/profile-$profile_id/profile_pictures",
                            "file_description" => "Profile",
                        ]);
                    }
                } else {
                    $dataProfile["created_by"] = Auth::id();
                    $createProfile = \App\Models\Profile::create($dataProfile);

                    if ($createProfile) {
                        $profile_id = $createProfile->id;

                        if ($request->hasFile('imagefile')) {
                            $folder_name = Str::random(10);
                            $this->create_attachment($createProfile, $request->file('imagefile'), [
                                "folder_name" => "profiles/profile-$profile_id/profile_pictures",
                                "file_description" => "Profile",
                            ]);
                        }
                    }
                }

                $department_id = $request->department_id;
                $contact_number = $request->contact_number;



                $this->user_persmissions($createUser->id, $request->user_role_id);

                $ret = [
                    "success" => true,
                    "message" => "refresh",
                ];
            }
        }

        return $ret;
    }

    public function update_user($request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not updated",
        ];

        $usersInfo = [
            "user_role_id" => $request->user_role_id,
            "updated_by" => Auth::id()
        ];

        if ($request->password) {
            $usersInfo['password'] = Hash::make($request->password);
        }

        // Update User
        $finduser = User::find($request->id);

        if ($finduser) {
            $finduserUpdate = $finduser->fill($usersInfo);
            $finduserUpdate->save();

            $dataProfile = [
                "firstname" => $request->firstname,
                "lastname" => $request->lastname,
                "user_id" => $finduser->id,
                "school_id" => $request->school_id,
                "civil_status_id" => $request->civil_status_id,
                "nationality_id" => $request->nationality_id,
                "gender" => $request->gender,
            ];

            $profile_id = "";

            $findProfilByUserId = \App\Models\Profile::where('user_id', $finduser->id)->first();

            if ($findProfilByUserId) {
                $profile_id = $findProfilByUserId->id;

                $dataProfile["updated_by"] = Auth::id();

                $findProfilByUserIdUpdate = $findProfilByUserId->fill($dataProfile);
                $findProfilByUserIdUpdate->save();

                if ($request->hasFile('imagefile')) {
                    $folder_name = "";

                    if ($findProfilByUserId->folder_name) {
                        $folder_name = $findProfilByUserId->folder_name;
                    } else {
                        $folder_name = Str::random(10);
                    }

                    $this->create_attachment($findProfilByUserId, $request->file('imagefile'), [
                        "folder_name" => "profiles/profile-$profile_id/profile_pictures",
                        "file_description" => "Profile",
                    ]);
                }
            } else {
                $dataProfile["created_by"] = Auth::id();
                $createProfile = \App\Models\Profile::create($dataProfile);

                if ($createProfile) {
                    $profile_id = $createProfile->id;

                    if ($request->hasFile('imagefile')) {
                        $this->create_attachment($createProfile, $request->file('imagefile'), [
                            "folder_name" => "profiles/profile-$profile_id/profile_pictures",
                            "file_description" => "Profile",
                        ]);
                    }
                }
            }



            $this->user_persmissions($finduser->id, $request->user_role_id);

            $ret = [
                "success" => true,
                "message" => "Data updated successfully",
            ];
        }

        return $ret;
    }

    public function add_user(Request $request)
    {
        $ret  = [
            "success" => true,
            "message" => "Data not created",
        ];

        $data = [
            "user_role_id" => $request->user_role_id,
            "username" => $request->username,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "created_by" => Auth::id(),
            "status" => 'Active',
        ];

        if ($request->id) {
            $data += [
                "updated_by" => Auth::id()
            ];
        } else {
            $data += [
                "created_by" => Auth::id()
            ];
        }

        $subject = User::updateOrCreate([
            "id" => $request->id,
        ], $data);
    }

    public function users_update_email(Request $request)
    {
        $ret  = [
            "success" => true,
            "message" => "Email not updated",
        ];

        $data = User::find($request->id);

        if ($data) {
            $data = $data->fill(["email" => $request->email]);
            if ($data->save()) {
                $ret  = [
                    "success" => true,
                    "message" => "Email updated successfully"
                ];
            }
        }

        return response()->json($ret, 200);
    }

    public function users_update_password(Request $request)
    {
        $ret  = [
            "success" => false,
            "message" => "Password not updated",
        ];

        $data = User::find($request->id);

        if ($data) {
            $data = $data->fill(["password" => Hash::make($request->new_password)]);
            if ($data->save()) {
                $ret  = [
                    "success" => true,
                    "message" => "Password updated successfully"
                ];
            }
        }

        return response()->json($ret, 200);
    }

    public function users_info_update_password(Request $request)
    {
        $ret  = [
            "success" => false,
            "message" => "Password not updated",
        ];

        $data = User::find($request->id);

        if ($data) {
            if (Hash::check($request->old_password, $data->password)) {
                $data = $data->fill(["password" => Hash::make($request->new_password)]);
                if ($data->save()) {
                    $ret  = [
                        "success" => true,
                        "message" => "Password updated successfully"
                    ];
                }
            } else {
                $ret  = [
                    "success" => false,
                    "message" => "Old password did not match",
                ];
            }
        } else {
            $ret  = [
                "success" => false,
                "message" => "No found data",
            ];
        }

        return response()->json($ret, 200);
    }

    public function user_update_role(Request $request)
    {
        $ret  = [
            "success" => false,
            "message" => "User role not updated",
        ];

        $findUser = User::find($request->id);

        if ($findUser) {
            if ($findUser->status === 'Active') {
                $findUser = $findUser->fill(["user_role_id" => $request->type, "user_role_id" => $request->user_role_id]);
                if ($findUser->save()) {
                    $ret  = [
                        "success" => true,
                        "message" => "User role updated successfully"
                    ];
                }
            }
        }

        return response()->json($ret, 200);
    }

    public function user_deactivate(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not deactivate"
        ];

        $findUser = User::find($request->id);

        if ($findUser) {
            if ($findUser->status === 'Active') {
                // deactivate user
                $findUser->status = 'Deactivated';
                $findUser->deactivated_by = Auth::id();
                $findUser->deactivated_at = now();

                if ($findUser->save()) {
                    $findUserProfile = Profile::where('id', $findUser->id)->first();

                    if ($findUserProfile) {
                        $findUserProfile->deactivated_by = Auth::id();
                        $findUserProfile->deactivated_at = now();
                        $findUserProfile->save();
                    }

                    $ret = [
                        "success" => true,
                        "message" => "Data deactivated successfully"
                    ];
                }
            }
        } else {
            $ret = [
                "success" => false,
                "message" => "Failed to deactivate data"
            ];
        }

        return response()->json($ret, 200);
    }

    public function user_toggle_status(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Action failed"
        ];

        $findUser = User::find($request->id);

        if ($findUser) {
            if ($findUser->status === 'Active') {
                // Deactivate user
                $findUser->status = 'Deactivated';
                $findUser->deactivated_by = Auth::id();
                $findUser->deactivated_at = now();
                $actionMsg = 'deactivated';

                // Soft delete the profile
                $profile = \App\Models\Profile::where('user_id', $findUser->id)->first();
                if ($profile) {
                    $profile->deleted_by = Auth::id();
                    $profile->deleted_at = now();
                    $profile->save();
                }
            } else {
                // Activate user
                $findUser->status = 'Active';
                $findUser->updated_by = Auth::id();
                $findUser->updated_at = now();
                $findUser->deactivated_by = null;
                $findUser->deactivated_at = null;
                $actionMsg = 'activated';

                // Restore the profile
                $profile = \App\Models\Profile::withTrashed()->where('user_id', $findUser->id)->first();
                if ($profile) {
                    $profile->deleted_by = null;
                    $profile->deleted_at = null;
                    $profile->save();
                }
            }

            if ($findUser->save()) {
                $ret = [
                    "success" => true,
                    "message" => "Data $actionMsg successfully",
                    "status" => $findUser->status

                ];
            }

            return response()->json($ret, 200);
        }
    }

    public function multiple_archived_user(Request $request)
    {
        $ret = [
            'success' => false,
            'message' => 'Data not archived!',
            'data' => $request->ids
        ];

        if ($request->has('ids') && count($request->ids) > 0) {
            foreach ($request->ids as $key => $value) {
                $findUser = User::find($value);

                if ($findUser) {
                    if ($request->isTrash == 0) {
                        $findUser->fill([
                            'deactivated_by' => Auth::id(),
                            'deactivated_at' => now(),
                            'status' => 'Archived'
                        ])->save();
                    } else if ($request->isTrash == 1) {
                        $findUser->fill([
                            'deactivated_by' => NULL,
                            'deactivated_at' => NULL,
                            'status' => 'Active'
                        ])->save();
                    }
                }
            }

            $ret = [
                'success' => true,
                'message' => 'Data ' . ($request->isTrash == 1 ? 'activated ' : 'archived') . ' successfully!',
            ];
        }

        return response()->json($ret, 200);
    }


    public function user_profile_info()
    {
        $data = User::with([
            "user_role",
            "profile" => function ($query) {
                $query->with([
                    "attachments" => function ($query1) {
                        $query1->orderBy("id", "desc")->limit(1);
                    },
                ]);
            }
        ])->find(Auth::id());

        return response()->json([
            "success" => true,
            "data" => $data
        ], 200);
    }

    public function user_profile_info_update(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not updated"
        ];

        $find = User::find(Auth::id());

        if ($find) {
            $findProfile = Profile::where("user_id", Auth::id())->first();

            if ($findProfile) {
                $findProfileUpdate = $findProfile->fill([
                    "firstname" => $request->firstname,
                    "lastname" => $request->lastname,
                    "civil_status_id" => $request->civil_status_id,
                    "nationality_id" => $request->nationality_id,
                    "gender" => $request->gender,
                ]);

                if ($findProfileUpdate->save()) {
                    ProfileContactInformation::where("profile_id", $findProfile->id)->update(['status' => 0]);

                    $checkContactNumber = ProfileContactInformation::where("profile_id", $findProfile->id)
                        ->where("contact_number", $request->contact_number)
                        ->first();

                    if ($checkContactNumber) {
                        $checkContactNumber->fill(['status' => 1])->save();
                    } else {
                        ProfileContactInformation::create([
                            "profile_id" => $findProfile->id,
                            "contact_number" => $request->contact_number,
                            "status" => 1
                        ]);
                    }

                    $ret = [
                        "success" => true,
                        "message" => "Data updated successfully"
                    ];
                }
            }
        }

        return response()->json($ret, 200);
    }

    public function existing_username(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not exist"
        ];

        $request->validate([
            'username' => 'required',
        ]);

        try {
            $findUsername = User::where("username", $request->username)->first();

            if ($findUsername) {

                $isActive = $findUsername->status !== 'Deactivated' ? true : false;

                if ($isActive === true) {
                    return response()->json([
                        "success" => true,
                        "message" => "User found",
                        "user_id" => $findUsername->id,
                    ], 200);
                } else {
                    return response()->json([
                        "success" => false,
                        "message" => "Username already exist but deactivated",
                        "user_id" => $findUsername->id,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            $ret = [
                "success" => false,
                "message" => "Data error: " . $e->getMessage(),
            ];
        }

        $ret += [
            "request" => $request->all()
        ];

        return response()->json($ret, 200);
    }



    public function user_photo_update(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "User photo not updated"
        ];

        $findProfile = User::find($request->id);

        if ($findProfile && $request->hasFile('user_picture')) {
            $create_attachment = $this->create_attachment($findProfile, $request->file('user_picture'), [
                "folder_name" => "users/user-$findProfile->id/user_pictures",
                "file_description" => "User Picture",
            ]);

            if ($create_attachment) {
                $ret = [
                    "success" => true,
                    "message" => "User photo updated successfully",
                ];
            }
        }

        return response()->json($ret, 200);
    }


    public function initial_registration(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Data not created",
        ];

        $dataUser  =  $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
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

        $profileData =  $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
        ]);

        DB::transaction(function () use ($request, &$ret, $profileData, $dataUser) {
            $VisitorUserRole = UserRole::where('role', 'Visitor')->first();

            $dataUser['user_role_id'] = $VisitorUserRole->id;
            $user = User::updateOrCreate(
                ['id' => $request->id ?? null],
                $dataUser
            );

            $profile = Profile::updateOrCreate(
                ['id' => $request->id ?? null],
                $profileData
            );

            if ($request->hasFile('profile_picture')) {
                $this->create_attachment($profile, $request->file('profile_picture'), [
                    "folder_name" => "profiles/profile-$profile->id/profile_picture",
                    "file_description" => "Profile Picture",
                ]);
            }

            // 🔑 Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            $ret = [
                "success" => true,
                "message" => "Data " . ($request->id ? "updated" : "saved") . " successfully",
                "data" => $user, // or include profile data if needed
                "token" => $token,
            ];
        });

        return response()->json($ret);
    }



    public function user_toggle_status_update(Request $request)
    {
        $ret = [
            "success" => false,
            "message" => "Action failed"
        ];

        $findUser = User::find($request->id);

        if ($findUser) {
            // Always set to Deactivated
            $findUser->status = 'Deactivated';
            $findUser->deactivated_by = Auth::id();
            $findUser->deactivated_at = now();
            $actionMsg = 'deactivated';

            // Soft delete the profile
            $profile = \App\Models\Profile::where('user_id', $findUser->id)->first();
            if ($profile) {
                $profile->deleted_by = Auth::id();
                $profile->deleted_at = now();
                $profile->save();
            }

            if ($findUser->save()) {
                $ret = [
                    "success" => true,
                    "message" => "Data $actionMsg successfully",
                    "status" => $findUser->status
                ];
            }

            return response()->json($ret, 200);
        }

        return response()->json($ret, 404);
    }
}