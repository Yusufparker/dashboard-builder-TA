<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntitySetting extends Model
{
    protected $fillable = [
        'project_entity_id',
        'endpoint',
        'is_api_enabled',
    ];
}
