<?php

namespace App\Http\Controllers;

use App\Exports\VisitationInformationExport;

use App\Models\UserNotification;
use App\Models\VisitaionInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class VisitaionInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $email = 'SELECT email FROM users WHERE id = (SELECT user_id FROM profiles WHERE id = visitaion_information.profile_id)';
        $available_time = "(SELECT CONCAT(DATE_FORMAT(date, '%M %d, %Y'), ' - ', available_time) FROM appointment_schedules WHERE id = visitaion_information.appointment_schedule_id)";
        $department_name = "(SELECT department_name FROM departments WHERE id = (SELECT department_id FROM appointment_schedules WHERE id = visitaion_information.appointment_schedule_id))";

        $query = VisitaionInformation::query()
            ->with(['profile', 'appointment_schedule', 'profile.user', 'appointment_schedule.department'])
            ->select([
                'visitaion_information.*',
                DB::raw("($email) AS email"),
                DB::raw("($available_time) AS available_time"),
                DB::raw("($department_name) AS department_name"),
            ])
            ->leftJoin('profiles', 'profiles.id', '=', 'visitaion_information.profile_id');

        if ($request->search) {
            $query->where(function ($q) use ($request, $email, $available_time, $department_name) {
                $q->orWhere(DB::raw("($available_time)"), 'LIKE', "%$request->search%")
                    ->orWhere(DB::raw("($email)"), 'LIKE', "%$request->search%")
                    ->orWhere(DB::raw("($department_name)"), 'LIKE', "%$request->search%");
            });
        }

        if ($request->status) {
            $status = explode(",", $request->status);
            $query->whereIn('visitaion_information.status', $status);
        }

        if ($request->user_id) {
            $query->where('profiles.user_id', $request->user_id);
        }

        if ($request->visitation_information_id) {
            $query->where('visitaion_information.id', $request->visitation_information_id);
        }

        if ($request->year_and_month_range) {
            $yearAndMonth = explode("-", $request->year_and_month_range);
            $year = $yearAndMonth[0];
            $month = $yearAndMonth[1];

            $query->whereYear('visitaion_information.created_at', $year)
                ->whereMonth('visitaion_information.created_at', $month);
        }



        if ($request->available_time) {
            $query->where('appointment_schedules.available_time', 'like', '%' . $request->available_time . '%');
        }

        if ($request->sort_field && $request->sort_order && $request->sort_field !== 'null' && $request->sort_order !== 'null') {
            $query->orderBy($request->sort_field, $request->sort_order);
        } else {
            $query->orderBy('visitaion_information.created_at', 'desc');
        }

        if ($request->page_size) {
            $data = $query->paginate($request->page_size, ['*'], 'page', $request->page);
        } else {
            $data = $query->get();
        }

        return response()->json([
            'success'   => true,
            'data'      => $data
        ], 200);
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
            "success" => true,
            "message" => "Visitation Information created successfully."
        ];


        $validated = $request->validate([
            'profile_id' => 'required|exists:profiles,id',
            'purpose_of_visit' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'appointments' => 'required|array|min:1',
            'appointments.*.appointment_schedule_id' => 'required|exists:appointment_schedules,id',
            'appointments.*.department_id' => 'nullable|exists:departments,id',
            'appointments.*.date' => 'nullable|date',
            'appointments.*.time' => 'nullable|string',
            'file_upload' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB
        ], [
            'file_upload.required' => 'Please upload a file',
            'file_upload.mimes' => 'Only PDF, DOC, and DOCX files are allowed',
            'file_upload.max' => 'File size must be less than 5MB',
            'appointments.required' => 'Please select at least one appointment',
            'appointments.min' => 'Please select at least one appointment',
        ]);

        try {
            DB::transaction(function () use ($request, &$ret) {
                $createdVisitations = [];
                $fileInfo = null;

                if ($request->hasFile('file_upload')) {
                    $file = $request->file('file_upload');

                    $originalName = $file->getClientOriginalName();
                    $safeName = preg_replace('/[^A-Za-z0-9\.\-]/', '_', $originalName);
                    $filename = time() . '_' . $request->profile_id . '_' . $safeName;

                    $folder = 'visitation-files/' . $request->profile_id;
                    $path = $file->storeAs($folder, $filename, 'public');

                    $fileInfo = [
                        'original_name' => $originalName,
                        'stored_name' => $filename,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'url' => Storage::url($path),
                    ];
                }

                foreach ($request->appointments as $index => $appointment) {

                    $visitation = VisitaionInformation::create([
                        'profile_id' => $request->profile_id,
                        'remarks' => $request->remarks ?? 'Submitted',
                        'appointment_schedule_id' => $appointment['appointment_schedule_id'],
                        'purpose_of_visit' => $request->purpose_of_visit,
                        'status' => 'pending',
                        'file_path' => $fileInfo['path'] ?? null,
                        'file_name' => $fileInfo['original_name'] ?? null,
                        'file_size' => $fileInfo['size'] ?? null,
                        'file_type' => $fileInfo['type'] ?? null,
                    ]);
                    UserNotification::create([
                        "user_id" => $request->profile_id,
                        "visitation_information_id" => $visitation->id,
                        "read" => false,
                        "status" => true,

                    ]);

                    $createdVisitations[] = $visitation;
                }

                $ret['success'] = true;
                $ret['message'] = "Successfully created " . count($createdVisitations) . " visitation(s)";
                $ret['data'] = $createdVisitations;
                $ret['file_info'] = $fileInfo ?? null;
                $ret['appointments_count'] = count($request->appointments);
            });
        } catch (\Throwable $th) {


            $ret['success'] = false;
            $ret['message'] = "An error occurred: " . $th->getMessage();
        }

        return response()->json($ret, $ret['success'] ? 200 : 500);
    }


    /**
     * Display the specified resource.
     */
    public function show(VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VisitaionInformation $visitaionInformation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VisitaionInformation $visitaionInformation)
    {
        //
    }

    public function export_visitation_information(Request $request)
    {
        if ($request->has('start_year') && $request->has('start_month')) {
            $request->validate([
                'start_year' => 'required|integer|min:2000|max:' . date('Y'),
                'start_month' => 'required|integer|min:1|max:12',
                'end_year' => 'required_with:end_month|integer|min:2000|max:' . date('Y'),
                'end_month' => 'required_with:end_year|integer|min:1|max:12',
            ]);

            $startYear = $request->input('start_year');
            $startMonth = $request->input('start_month');
            $endYear = $request->input('end_year', $startYear);
            $endMonth = $request->input('end_month', $startMonth);

            $startDate = Carbon::create($startYear, $startMonth, 1)->startOfMonth();
            $endDate = Carbon::create($endYear, $endMonth, 1)->endOfMonth();

            if ($endDate->lt($startDate)) {
                return response()->json([
                    'error' => 'End date must be after start date'
                ], 422);
            }

            $startMonthFormatted = str_pad($startMonth, 2, '0', STR_PAD_LEFT);
            $endMonthFormatted = str_pad($endMonth, 2, '0', STR_PAD_LEFT);

            if ($startYear == $endYear && $startMonth == $endMonth) {
                $fileName = "visitations_{$startYear}_{$startMonthFormatted}.xlsx";
            } else {
                $fileName = "visitations_{$startYear}_{$startMonthFormatted}_to_{$endYear}_{$endMonthFormatted}.xlsx";
            }

            return Excel::download(
                new VisitationInformationExport($startYear, $startMonth, $endYear, $endMonth),
                $fileName
            );
        } else {
            $request->validate([
                'year' => 'required|integer|min:2000|max:' . date('Y'),
                'month' => 'required|integer|min:1|max:12',
            ]);

            $year = $request->input('year');
            $month = $request->input('month');

            $monthFormatted = str_pad($month, 2, '0', STR_PAD_LEFT);

            $fileName = "visitations_{$year}_{$monthFormatted}.xlsx";

            return Excel::download(
                new VisitationInformationExport($year, $month, $year, $month),
                $fileName
            );
        }
    }
}