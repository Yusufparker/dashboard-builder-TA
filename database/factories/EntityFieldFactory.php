<?php

namespace Database\Factories;

use App\Models\EntityField;
use App\Models\ProjectEntity;
use App\Models\FieldType;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntityFieldFactory extends Factory
{
    protected $model = EntityField::class;

    public function definition()
    {
        return [
            'project_entity_id' => ProjectEntity::factory(),
            'title' => $this->faker->sentence(3),
            'type_id' => FieldType::factory(), // Bisa diganti ID tertentu kalau data fix
            'is_required' => $this->faker->boolean(),
            'is_readonly' => $this->faker->boolean(),
            'default_value' => $this->faker->optional()->word(),
        ];
    }
}
