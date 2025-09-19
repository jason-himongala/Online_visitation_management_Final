<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use ModelTrait;


    protected $guarded = [];





    public function scopeFilter($query, $request)
    {
        if ($request->chat_id) {
            $query->where("chat_id", $request->chat_id);
        }

        return $query;
    }



    public function chats()
    {
        return $this->hasMany(Chat::class, 'chat_id');
    }

    public function chat_members()
    {
        return $this->hasMany(ChatMember::class, 'chat_member_id');
    }

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'profile_id');
    }
}