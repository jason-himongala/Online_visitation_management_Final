<?php

namespace App\Models;

use App\Traits\ModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class VisitationForm extends Model
{
    use HasFactory, ModelTrait;

    protected $fillable = [
        'user_id',
        'visitation_information_id',
        'purpose_of_visit',
        'selected_faculty_centered_office_organization_to_visit',
        'manner_of_engagement',
        'name_of_institution_agency',
        'topics_for_discussion',
        'other_information_concern',
        'preferred_date_of_visit',
        'preferred_time_of_visit',
        'alternate_date_of_visit',
        'alternate_time_of_visit',
        'remarks',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
    ];

    protected $casts = [
        'preferred_date_of_visit' => 'date',
        'alternate_date_of_visit' => 'date',
        'file_size' => 'integer',
    ];

    protected $appends = ['file_url'];

    public function profile_delegate()
    {
        return $this->hasMany(ProfileDelegates::class, 'visitation_form_id');
    }

    public function visitation_information()
    {
        return $this->belongsTo(VisitaionInformation::class, 'visitation_information_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function scopeFilter($query, $request)
    {

        return $query;
    }

    public function getFileUrlAttribute()
    {
        if ($this->file_path && Storage::disk('public')->exists($this->file_path)) {
            return Storage::disk('public')->url($this->file_path);
        }
        return null;
    }

    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size) return null;

        $size = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2) . ' ' . $units[$i];
    }
}