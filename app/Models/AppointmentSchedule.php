<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppointmentSchedule extends Model
{

    use SoftDeletes, ModelTrait;
    protected $guarded = [];



    public function scopeFilter($query, $request)
    {


        return $query;
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}