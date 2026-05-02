<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurposeOfVisti extends Model
{
    use  SoftDeletes, ModelTrait;

    protected $guarded = [];


    public function school_purpose()
    {
        return $this->belongsTo(SchoolPurpose::class, 'school_purpose_id');
    }

    public function scopeFilter($query, $request)
    {

        return $query;
    }
}
