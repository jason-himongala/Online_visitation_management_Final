<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chat extends Model
{
    use  ModelTrait;


    protected $guarded = [];


    public function scopeFilter($query, $request)
    {

        return $query;
    }
}
