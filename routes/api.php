<?php

use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Request;

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
Route::post('initial_registration', [App\Http\Controllers\UserController::class, "initial_registration"]);
Route::post('profiles_signup', [App\Http\Controllers\ProfileController::class, 'profiles_signup']);
// Route::post('update_profile_photo', [App\Http\Controllers\ProfileController::class, 'update_profile_photo']);
Route::get('export_visitation_information', [App\Http\Controllers\VisitaionInformationController::class, 'export_visitation_information']);
Route::post('submit_contact', [App\Http\Controllers\ContactController::class, 'submit_contact']);



Route::middleware('auth:api')->group(function () {
    Route::get('check_auth_status', [App\Http\Controllers\AuthController::class, "check_auth_status"]);
    Route::post('update_profile_photo', [App\Http\Controllers\ProfileController::class, 'update_profile_photo']);




    // UserController
    Route::post('existing_username', [App\Http\Controllers\UserController::class, "existing_username"]);
    Route::post('add_user', [App\Http\Controllers\UserController::class, "add_user"]);
    Route::post('user_toggle_status', [App\Http\Controllers\UserController::class, "user_toggle_status"]);
    Route::post('user_toggle_status_update', [App\Http\Controllers\UserController::class, "user_toggle_status_update"]);
    Route::apiResource('users', App\Http\Controllers\UserController::class);
    Route::apiResource('contacts', App\Http\Controllers\ContactController::class);
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
    Route::post('profile_archive_restore', [App\Http\Controllers\ProfileController::class, 'profile_archive_restore']);
    Route::apiResource('profiles',  App\Http\Controllers\ProfileController::class);

    Route::post('profile_student_enrolled_status', [App\Http\Controllers\ProfileController::class, 'profile_student_enrolled_status']);
    //End ProfileController

    Route::get('generate_visitation_certificates', [App\Http\Controllers\ProfileDelegatesController::class, 'generate_visitation_certificates']);

    //UserRoleController
    Route::apiResource('user_role', App\Http\Controllers\UserRoleController::class);
    Route::post('user_role_archive', [App\Http\Controllers\UserRoleController::class, 'user_role_archive']);
    //End UserRoleController

    //AppointmentScheduleController
    Route::apiResource('appointment_schedule', App\Http\Controllers\AppointmentScheduleController::class);
    //End AppointmentScheduleController


    // DepartmentController
    Route::apiResource('departments', App\Http\Controllers\DepartmentController::class);
    // END DepartmentController

    //VisitaionInformationController
    Route::apiResource('visitation_information', App\Http\Controllers\VisitaionInformationController::class);
    //End VisitaionInformationController


    //VisitorRequestController
    Route::apiResource('visitor_requests', App\Http\Controllers\VisitorRequestController::class);
    //End VisitorRequestController

    //ChatMemberController
    Route::apiResource('chat_members', App\Http\Controllers\ChatMemberController::class);
    //End ChatMemberController

    //ChatMemberController
    Route::apiResource('chat', App\Http\Controllers\ChatController::class);
    //End ChatMemberController

    //ConversationController
    Route::apiResource('conversations_chat', App\Http\Controllers\ConversationController::class);
    //End ConversationController


    //VisitationFormController
    Route::apiResource('visitation_forms', App\Http\Controllers\VisitationFormController::class);
    //End VisitationFormController

    //FeedbackController
    Route::apiResource('feedback', App\Http\Controllers\FeedbackController::class);
    //End FeedbackController

    //ProfileDelegatesController
    Route::apiResource('profile_delegates', App\Http\Controllers\ProfileDelegatesController::class);
    //End ProfileDelegatesController

    //DashboardController
    Route::get('dashboard_card_list', [App\Http\Controllers\DashboardController::class, 'dashboard_card_list']);
    //End DashboardController

    //DepartmentController
    Route::apiResource('department', App\Http\Controllers\DepartmentController::class);
    Route::post('department_archive', [App\Http\Controllers\DepartmentController::class, 'department_archive']);
    //End DepartmentController


    //UserNotificationController
    Route::apiResource('user_notifications', App\Http\Controllers\UserNotificationController::class);
    //End UserNotificationController


});