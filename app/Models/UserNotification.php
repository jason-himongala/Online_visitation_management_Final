<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Passport\HasApiTokens;

class UserNotification extends Model
{
    use HasApiTokens, SoftDeletes;

    protected $guarded = [];

    public function scopeSearch($query, $request)
    {
        $search = $request->search;
        return $query->where(function ($q) use ($search) {
            $q->orWhere('section', 'LIKE', "%$search%");
        });
    }


    public function scopeSortable($query, $request)
    {
        if ($request->sort_order != '' && $request->sort_field != '') {
            return $query->orderBy($request->sort_field, $request->sort_order ?: 'desc');
        } else {
            return $query->orderBy('id', 'asc');
        }
    }

    public function scopePagination($query, $request)
    {
        if ($request->page_size) {
            return $query->paginate($request->page_size, ['*'], 'page', $request->page)->toArray();
        } else {
            return $query->get();
        }
    }
    public function scopeFilter($query, $request)
    {
        if ($request->status) {
            return $query->where('status', $request->status);
        }

        if ($request->user_id) {
            return $query->where('user_id', $request->user_id);
        }

        if ($request->created_by) {
            return $query->where('created_by', $request->created_by);
        }
        if ($request->isTrash) {
            $query->onlyTrashed();
        }


        return $query;
    }

    public function scopeGradeLevelsJoin($query)
    {
        return $query->leftJoin('grade_levels', 'grade_levels.id', '=', 'sections.grade_level_id')
            ->addSelect([
                'sections.*',
                'grade_levels.grade_level as grade_level_name'
            ]);
    }


    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }
}