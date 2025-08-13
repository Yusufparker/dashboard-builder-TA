<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectEntity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectEntityFactory extends Factory
{
    protected $model = ProjectEntity::class;

    public function definition()
    {
        return [
            'uuid' => $this->faker->uuid(),
            'project_id' => Project::factory(),
            'name' => $this->faker->word(),
        ];
    }
}
