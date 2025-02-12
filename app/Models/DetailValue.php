<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailValue extends Model
{
    protected $fillable = [
        'entity_field_value_id',
        'entity_field_id',   
        'value',
    ];

    public function field()
    {
        return $this->belongsTo(EntityField::class, 'entity_field_id', 'id');
    }

}
