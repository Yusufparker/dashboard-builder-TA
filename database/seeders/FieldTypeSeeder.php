<?php

namespace Database\Seeders;

use App\Models\FieldType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class FieldTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/field_types.json');
        $jsonData = File::get($jsonPath);

        // Decode JSON menjadi array
        $fieldTypes = json_decode($jsonData, true);

        foreach ($fieldTypes as $fieldType) {
            FieldType::updateOrCreate(
                ['name' => $fieldType['name']],
                [
                    'description' => $fieldType['description'],
                    'icon' => $fieldType['icon']
                ]
            );
            $this->command->info('successfully adding ' . $fieldType['name'] . ' to table field_types..');
        }
        
    }
}
