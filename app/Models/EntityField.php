<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- tambahkan ini
use Illuminate\Database\Eloquent\Model;

class EntityField extends Model
{
    use HasFactory; // <-- tambahkan ini

    protected $fillable = [
        'project_entity_id',
        'title',
        'type_id',
        'is_required',
        'is_readonly',
        'default_value',
    ];

    public function type()
    {
        return $this->belongsTo(FieldType::class);
    }
}
