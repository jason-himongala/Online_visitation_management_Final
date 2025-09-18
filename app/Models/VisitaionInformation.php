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


    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }


    public function visitaion_information()
    {
        return $this->hasMany(VisitaionInformation::class, 'visitaion_information_id');
    }
}