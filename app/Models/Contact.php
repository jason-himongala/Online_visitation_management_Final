<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{


    use ModelTrait;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(Profile::class, 'user_id', 'id');
    }

    public function scopeFilter($query, $request)
    {
        if ($request->has('user_id') && !empty($request->user_id)) {
            $query->where('user_id', $request->user_id);
        }

        return $query;
    }
}
