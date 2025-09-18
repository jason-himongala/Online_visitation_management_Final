<?php

namespace App\Models;

use App\Http\Controllers\ProfileSchoolAttendedController;
use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use HasFactory, SoftDeletes, ModelTrait;

    protected $guarded = [];


    public function scopeFilter($query, $request)
    {
        if ($request->profile_id) {
            return $query->where('id', $request->profile_id);
        }
        // if ($request->status) {
        //     return $query->where('status', $request->status);
        // }

        if ($request->status) {
            $status = explode(',', $request->status);
            $query->whereIn("status", $status);
        }
        if ($request->lrn) {
            return $query->where('lrn', $request->lrn);
        }
        if ($request->gender) {
            return $query->where('gender', $request->gender);
        }
        if ($request->year) {
            return $query->whereYear('created_at', '=', $request->year);
        }

        if ($request->from === 'users') {
            $query->whereHas('user.user_role', function ($q) {
                $q->whereIn('role', ['Subject Teacher', 'Subject Adviser']);
            });

            $query->where('id', '!=', 1); // Exclude the default profile


            if ($request->isTrash) {
                $query->onlyTrashed();
            }

            // if (!$hasFilters) {
            //     $query->whereRaw('1 = 0');
            // }
            return $query;
        }

        if ($request->from === "PageRegistrationStatusValidation") {
            $query->where('status', 'Validated');
        }


        return $query;
    }


    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }



    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachmentable');
    }

    public function visitation_informations()
    {
        return $this->hasMany(VisitaionInformation::class, 'profile_id');
    }

    public function historicalData()
    {
        return $this->morphMany(HistoricalData::class, 'historyable');
    }
}