<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntityField extends Model
{
    protected $fillable = [
        'project_entity_id',
        'title',
        'type_id',
        'is_required',
    ];

    public function type(){
        return $this->belongsTo(FieldType::class);
    }
}
