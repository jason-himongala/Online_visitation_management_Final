<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Passport\HasApiTokens;

class UserNotification extends Model
{
    use HasApiTokens,  ModelTrait;


    protected $guarded = [];


    public function scopeFilter($query, $request)
    {


        return $query;
    }

    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function visitaion_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }
}