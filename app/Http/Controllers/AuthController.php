<?php


namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $ret = [
            'success' => false,
            'message' => 'Unrecognized username or password. <b>Forgot your password?</b>',
        ];

        $studentAllowedURL = explode(",", env("APP_ALLOWED_DOMAINS_STUDENT"));
        $host = $request->getHttpHost();

        $credentialsEmail = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (auth()->attempt($credentialsEmail)) {
            $user = auth()->user();
            $login_data = $this->login_data($request, $user);

            if (in_array($user->user_role_id, [6, 7])) {
                if (!empty(env("APP_ALLOWED_DOMAINS_STUDENT")) && in_array($host, $studentAllowedURL)) {
                    $ret = [
                        'success' => $login_data["success"],
                        'message' => $login_data["message"],
                        'data' => $login_data["data"],
                        'token' => $login_data["token"],
                    ];
                } else {
                    $ret = [
                        'success' => false,
                        'message' => 'Unrecognized username or password. <b>Forgot your password?</b>',
                    ];
                }
            } else {
                $ret = [
                    'success' => $login_data["success"],
                    'message' => $login_data["message"],
                    'data' => $login_data["data"],
                    'token' => $login_data["token"],
                ];
            }
        } else {
            $credentialsUsername = [
                'username' => $request->email,
                'password' => $request->password
            ];

            if (auth()->attempt($credentialsUsername)) {
                $user = auth()->user();
                $login_data = $this->login_data($request, $user);

                if (in_array($user->user_role_id, [6, 7])) {
                    if (!empty(env("APP_ALLOWED_DOMAINS_STUDENT")) && in_array($host, $studentAllowedURL)) {
                        $ret = [
                            'success' => $login_data["success"],
                            'message' => $login_data["message"],
                            'data' => $login_data["data"],
                            'token' => $login_data["token"],
                            'visitor_token' => $login_data["visitor_token"] ?? null,
                        ];
                    } else {
                        $ret = [
                            'success' => false,
                            'message' => 'Unrecognized username or password. <b>Forgot your password?</b>',
                        ];
                    }
                } else {
                    $ret = [
                        'success' => $login_data["success"],
                        'message' => $login_data["message"],
                        'data' => $login_data["data"],
                        'token' => $login_data["token"],
                        'visitor_token' => $login_data["visitor_token"] ?? null,
                    ];
                }
            } else {
                $ret = [
                    'success' => false,
                    'message' => 'Unrecognized username or password. <b>Forgot your password?</b>',
                ];
            }
        }

        $ret['host'] = $host;

        return response()->json($ret, 200);
    }

    public function login_data($request, $user)
    {
        $success = false;
        $message = "";
        $token = null;

        $dataProfile = \App\Models\Profile::with(["attachments" => function ($q) {
            return $q->orderBy("id", "desc");
        }])->firstWhere("user_id", $user->id);
        $dataUserRole = \App\Models\UserRole::find($user->user_role_id);

        $profile_id = "";
        $firstname = "";
        $lastname = "";
        $profile_picture = "";

        if ($dataProfile) {
            $profile_id = $dataProfile->id ?? null;
            $firstname = $dataProfile->firstname ?? null;
            $lastname = $dataProfile->lastname ?? null;

            // FIX: Check if attachments is a non-empty collection
            if (!empty($dataProfile->attachments) && $dataProfile->attachments->count() > 0) {
                $profile_picture = $dataProfile->attachments->first()->file_path ?? null;
            }
        }

        $user['profile_id'] = $profile_id;
        $user['firstname'] = $firstname;
        $user['lastname'] = $lastname;
        $user['profile_picture'] = $profile_picture;

        $role = "";
        $role_type = "";

        if ($dataUserRole) {
            $role = $dataUserRole->role;
            $role_type = $dataUserRole->type;
        }

        $user['role'] = $role;
        $user['role_type'] = $role_type;

        if ($user->status == 'Active') {
            if ($request->from) {
                if (in_array($user->user_role_id, [1, 2])) {
                    if ($request->from == 'faculty_monitoring_attendance_checker') {
                        $success = true;
                        $token = $user->createToken(date('Y') . '-' . env('APP_NAME'))->accessToken;
                    } else {
                        $message = "Permission not allowed!";
                    }
                } else {
                    $success = true;
                    $token = $user->createToken(date('Y') . '-' . env('APP_NAME'))->accessToken;
                }
            } else {
                $success = true;
                $token = $user->createToken(date('Y') . '-' . env('APP_NAME'))->accessToken;
            }
        } else if ($user->status == 'Deactivated') {
            $message = "This account is deactivated!";
        } else {
            $message = "Unrecognized username or password. <b>Forgot your password?</b>";
        }

        return [
            "success" => $success,
            "message" => $message,
            "token" => $token,
            "data" => $user
        ];
    }



    public function check_auth_status()
    {
        $ret = [
            "success" => false,
            "message" => "Authentication status ok",
        ];

        return response()->json($ret, 200);
    }
}