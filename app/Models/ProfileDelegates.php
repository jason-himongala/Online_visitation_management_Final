<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class ProfileDelegates extends Model
{
    use ModelTrait;


    protected $guarded = [];


    public function scopeFilter($query, $request)
    {
        if (isset($request['visitation_information_id']) && $request['visitation_information_id']) {
            $query->whereHas('visitation_forms', function ($q) use ($request) {
                $q->where('visitation_information_id', $request['visitation_information_id']);
            });
        }
        return $query;
    }

    public function visitation_forms()
    {
        return $this->belongsTo(VisitationForm::class, 'visitation_form_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}