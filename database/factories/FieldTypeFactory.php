<?php
// database/factories/FieldTypeFactory.php
namespace Database\Factories;

use App\Models\FieldType;
use Illuminate\Database\Eloquent\Factories\Factory;

class FieldTypeFactory extends Factory
{
    protected $model = FieldType::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence, // tambahkan ini
            'icon' => $this->faker->word,
            
        ];
    }
}
