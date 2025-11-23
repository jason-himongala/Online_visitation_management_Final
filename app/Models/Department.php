<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{

    use HasFactory, SoftDeletes, ModelTrait;

    protected $guarded = [];


    public function scopeFilter($query, $request)
    {
        if ($request->isTrash) {
            $query->onlyTrashed();
        }
        return $query;
    }
}
