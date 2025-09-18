<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChatMember extends Model
{
    use SoftDeletes, ModelTrait;


    protected $guarded = [];




    public function scopeFilter($query, $request)
    {
        // if ($request->status) {
        //     return $query->where('status', $request->status);
        // }


        return $query;
    }

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }


    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}