<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Container\Attributes\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB as FacadesDB;

class VisitorRequest extends Model
{
    use ModelTrait;


    protected $guarded = [];


    public function scopeFilter($query, $request)
    {
        if ($request->visitation_information) {
            $statuses = array_filter(explode(',', $request->visitation_information));
            $query->whereIn('visitation_information.status', $statuses);
        }

        if ($request->available_time) {
            $val = strtolower(trim($request->available_time));
            switch ($val) {
                case 'whole day':
                    $query->where('available_time', 'Whole Day');
                    break;
                case '8:00 am - 12:00 pm':
                    $query->where('available_time', '8:00 AM - 12:00 PM');
                    break;
                case '12:00 pm - 5:00 pm':
                    $query->where('available_time', '12:00 PM - 5:00 PM');
                    break;
                default:
                    $query->where(function ($q) use ($val) {
                        $q->whereRaw('LOWER(available_time) = ?', [$val])
                            ->orWhereRaw('LOWER(available_time) LIKE ?', ["%{$val}%"]);
                    });
                    break;
            }
        }

        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        if ($request->check_profile_conflict && $request->appointment_schedule_id) {
            $query->where('appointment_schedule_id', $request->appointment_schedule_id);
        }

        if ($request->check_profile_date_conflict && $request->profile_id && $request->check_date) {
            $query->where('profile_id', $request->profile_id)
                ->whereDate('date', $request->check_date);
        }

        return $query;
    }

  

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitaion_information_id');
    }
}