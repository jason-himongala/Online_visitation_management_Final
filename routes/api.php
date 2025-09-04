<?php

use App\Models\StudentGrade;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('api.access')->group(function () {

// Your API routes go here


Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);


Route::middleware('auth:api')->group(function () {
    Route::get('check_auth_status', [App\Http\Controllers\AuthController::class, "check_auth_status"]);

    // UserController
    Route::post('existing_username', [App\Http\Controllers\UserController::class, "existing_username"]);

    Route::post('multiple_archived_user', [App\Http\Controllers\UserController::class, "multiple_archived_user"]);
    Route::post('user_deactivation', [App\Http\Controllers\UserController::class, "user_deactivation"]);
    Route::post('user_toggle_status', [App\Http\Controllers\UserController::class, "user_toggle_status"]);
    Route::post('user_photo_update', [App\Http\Controllers\UserController::class, "user_photo_update"]);
    Route::get('user_profile_info', [App\Http\Controllers\UserController::class, "user_profile_info"]);
    Route::post('user_profile_info_update', [App\Http\Controllers\UserController::class, "user_profile_info_update"]);
    Route::post('user_update_role', [App\Http\Controllers\UserController::class, "user_update_role"]);
    Route::post('user_deactivate', [App\Http\Controllers\UserController::class, "user_deactivate"]);
    Route::post('users_update_email', [App\Http\Controllers\UserController::class, "users_update_email"]);
    Route::post('users_update_password', [App\Http\Controllers\UserController::class, "users_update_password"]);
    Route::post('users_info_update_password', [App\Http\Controllers\UserController::class, "users_info_update_password"]);
    Route::post('add_user', [App\Http\Controllers\UserController::class, "add_user"]);
    Route::apiResource('users', App\Http\Controllers\UserController::class);
    // END UserController

    // UserPermissionController
    Route::post('user_permission_status', [App\Http\Controllers\UserPermissionController::class, 'user_permission_status']);
    Route::apiResource('user_permission', App\Http\Controllers\UserPermissionController::class);
    // END UserPermissionController

    // ModuleController
    Route::post('module_multi_update_permission_status', [App\Http\Controllers\ModuleController::class, 'module_multi_update_permission_status']);
    Route::post('module_update_permission_status', [App\Http\Controllers\ModuleController::class, 'module_update_permission_status']);
    Route::apiResource('module', App\Http\Controllers\ModuleController::class);
    // END ModuleController

    // UserRolePermissionController
    Route::apiResource('user_role_permission', App\Http\Controllers\UserRolePermissionController::class);
    // END UserRolePermissionController

    // EmailTemplateController
    Route::post('email_template_multiple', [App\Http\Controllers\EmailTemplateController::class, 'email_template_multiple']);
    Route::apiResource('email_template', App\Http\Controllers\EmailTemplateController::class);
    // END EmailTemplateController



    // ProfileController
    Route::post('update_profile_photo', [App\Http\Controllers\ProfileController::class, "update_profile_photo"]);
    Route::post('profile_archive_restore', [App\Http\Controllers\ProfileController::class, 'profile_archive_restore']);
    Route::apiResource('profiles',  App\Http\Controllers\ProfileController::class);

    Route::post('profile_student_enrolled_status', [App\Http\Controllers\ProfileController::class, 'profile_student_enrolled_status']);
    //End ProfileController


    //UserRoleController
    Route::apiResource('user_role', App\Http\Controllers\UserRoleController::class);
    Route::post('user_role_archive', [App\Http\Controllers\UserRoleController::class, 'user_role_archive']);
    //End UserRoleController

    //EmailTemplateController
    Route::post('email_template_multiple', [App\Http\Controllers\EmailTemplateController::class, 'email_template_multiple']);
    Route::apiResource('email_templates', App\Http\Controllers\EmailTemplateController::class);
    //END EmailTemplateController
});

Route::get('test_pass', function () {
    echo Hash::make('Admin123!');
});