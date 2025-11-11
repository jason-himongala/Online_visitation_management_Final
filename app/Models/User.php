<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, ModelTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'email_verified_at',
        'username',
        'password',
        'user_role_id',
        'department_id',
        'status',
        'role', // <-- add this line to allow mass assignment
        'one_time_update_info',
        'google2fa_enable',
        'google2fa_secret',
        'remember_token',
        'created_by',
        'updated_by',
        'deactivated_by',
        'deactivated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function scopeFilter($query, $request)
    {
        if ($request->user_id) {
            $query->where('id', $request->user_id);
        }

        if ($request->created_by) {
            $query->where('created_by', $request->created_by);
        }

        // if ($request->isTrash) {
        //     $query->onlyTrashed();
        // }

        if ($request->username) {
            $query->where('username', 'like', '%' . $request->username . '%');
        }

        if ($request->user_role_ids) {
            $user_role_ids = explode(',', $request->user_role_ids);
            $query = $query->whereIn("user_role_id", $user_role_ids);
        }

        if ($request->status) {
            $query->where("status", $request->status);
        }

        if ($request->role_types) {
            $role_types = explode(',', $request->role_types);
            $query = $query->whereHas('user_role', function ($query) use ($role_types) {
                $query->whereIn('type', $role_types);
            });
        }
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, "user_id");
    }



    public function user_role()
    {
        return $this->belongsTo(UserRole::class, "user_role_id");
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachmentable');
    }


    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
