<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitaionInformation extends Model
{
    use SoftDeletes, ModelTrait;

    protected $guarded = [];

    public function scopeFilter($query, $request)
    {
        $query->join('appointment_schedules', 'visitaion_information.appointment_schedule_id', '=', 'appointment_schedules.id')
            ->select('visitaion_information.*', 'appointment_schedules.date', 'appointment_schedules.available_time');

        if ($request->status) {
            $status = explode(",", $request->status);
            $query->whereIn('visitaion_information.status', $status);
        }

        if ($request->user_id) {
            $query->whereHas('profile.user', function ($q) use ($request) {
                $q->where('users.id', $request->user_id);
            });
        }

        if ($request->year_and_month_range) {
            $yearAndMonth = explode("-", $request->year_and_month_range);
            $year = $yearAndMonth[0];
            $month = $yearAndMonth[1];

            $query->whereYear('visitaion_information.created_at', $year)
                ->whereMonth('visitaion_information.created_at', $month);
        }

        if ($request->check_schedule_booked && $request->appointment_schedule_id) {
            $query->where('visitaion_information.appointment_schedule_id', $request->appointment_schedule_id);
        }
        if ($request->available_time) {
            $query->where('appointment_schedules.available_time', 'like', '%' . $request->available_time . '%');
        }

        return $query;
    }

    public function scopeWithAppointmentSchedule($query)
    {
        return $query->join('appointment_schedules', 'visitaion_information.appointment_schedule_id', '=', 'appointment_schedules.id')
            ->select('visitaion_information.*', 'appointment_schedules.date', 'appointment_schedules.available_time');
    }

    public function appointment_schedule()
    {
        return $this->belongsTo(AppointmentSchedule::class, 'appointment_schedule_id');
    }

    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }
    public function purpose_of_visit()
    {
        return $this->belongsTo(PurposeOfVisti::class, 'purpose_of_visit_id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function user()
    {
        return $this->hasOneThrough(User::class, Profile::class, 'id', 'id', 'profile_id', 'user_id');
    }

    public function user_notification()
    {
        return $this->hasMany(UserNotification::class, 'visitaion_information_id');
    }
}
