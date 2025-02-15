<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectEntity extends Model
{
    protected $fillable = [
        'uuid',
        'project_id',
        'name'
    ];

    public function fields(){
        return $this->hasMany(EntityField::class);
    }

    public function values(){
        return $this->hasMany(EntityFieldValue::class);
    }

    public function setting(){
        return $this->hasOne(EntitySetting::class);
    }

}
