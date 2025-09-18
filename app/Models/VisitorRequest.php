<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class VisitorRequest extends Model
{
    use ModelTrait;


    protected $guarded = [];


    public function scopeFilter($query, $request)
    {
        if ($request->visitation_information) {
            $visitation_information = explode(",", $request->visitation_information);

            $query->whereIn('visitation_information.status', $visitation_information);
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