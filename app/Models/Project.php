<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // ⬅️ Tambahin ini
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory; // ⬅️ Tambahin ini

    protected $fillable = ['uuid', 'name', 'description', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function entities()
    {
        return $this->hasMany(ProjectEntity::class);
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($project) {
            // delete related entities, fields, values, and settings
            $project->entities->each(function ($entity) {
                $entity->delete();
            });

            $project->members()->delete();
        });
    }
}
