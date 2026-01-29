<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitationForm extends Model
{
    use ModelTrait, SoftDeletes;


    public function scopeFilter($query, $request)
    {
        if ($request->status) {
            $query->whereHas('visitation_information', function ($q) {
                $q->whereRaw('LOWER(status) = ?', ['approved']);
            });
        }

        return $query;
    }


    protected $guarded = [];

    public function profile_delegate()
    {
        return $this->hasMany(ProfileDelegates::class, 'visitation_form_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }


    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}
