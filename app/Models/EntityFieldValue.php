<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- tambahkan ini


use Illuminate\Database\Eloquent\Model;

class EntityFieldValue extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_entity_id',
        'user_id',
    ];


    public function  detailValues(){
        return $this->hasMany(DetailValue::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($value) {
            $value->detailValues()->delete();
        });
    }
}
