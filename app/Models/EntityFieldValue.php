<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntityFieldValue extends Model
{
    protected $fillable = [
        'project_entity_id',
        'user_id',
    ];


    public function  detailValues(){
        return $this->hasMany(DetailValue::class);
    }
}
