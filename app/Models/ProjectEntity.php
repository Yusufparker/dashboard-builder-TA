<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // ← Tambahkan ini
use Illuminate\Database\Eloquent\Model;

class ProjectEntity extends Model
{
    use HasFactory; // ← Tambahkan ini

    protected $fillable = [
        'uuid',
        'project_id',
        'name'
    ];

    public function fields()
    {
        return $this->hasMany(EntityField::class);
    }

    public function values()
    {
        return $this->hasMany(EntityFieldValue::class);
    }

    public function setting()
    {
        return $this->hasOne(EntitySetting::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($entity) {
            $entity->fields()->delete();
            $entity->values()->delete();
            $entity->setting()?->delete();
        });
    }
}
