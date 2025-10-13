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



        if ($request->status) {
            $status = explode(",", $request->status);

            $query->whereIn('visitaion_information.status', $status);
        }

    
        return $query;
    }


    public function appointment_schedule()
    {
        return $this->belongsTo(AppointmentSchedule::class, 'appointment_schedule_id');
    }


    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }


    public function user()
    {
        return $this->hasOneThrough(User::class, Profile::class, 'id', 'id', 'profile_id', 'user_id');
    }
}