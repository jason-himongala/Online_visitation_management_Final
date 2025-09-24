<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use ModelTrait;

    protected $guarded = [];





    public function scopeFilter($query, $request)
    {


        return $query;
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }
}