<?php

namespace Database\Factories;

use App\Models\EntityFieldValue;
use App\Models\ProjectEntity; // kalau ada modelnya
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntityFieldValueFactory extends Factory
{
    protected $model = EntityFieldValue::class;

    public function definition()
    {
        return [
            'project_entity_id' => ProjectEntity::factory(), // bikin relasi langsung
            'user_id' => User::factory(),
        ];
    }
}
