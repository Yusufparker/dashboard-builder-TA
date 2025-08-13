<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\ProjectEntity;
use App\Models\EntityField;
use App\Models\EntityFieldValue;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EntityValueControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware();
    }

    /** @test */
    public function it_can_store_entity_value_successfully()
    {
        // Buat user dan login
        $user = User::factory()->create();
        $this->actingAs($user);

        // Buat project dan entity
        $project = Project::factory()->create(['user_id' => $user->id]);
        $entity = ProjectEntity::factory()->create(['project_id' => $project->id]);

        // Buat field untuk entity
        $field = EntityField::factory()->create([
            'project_entity_id' => $entity->id,
            'title' => 'Nama',
            'type_id' => 1
        ]);

        // Payload values
        $payload = [
            'project_id' => $project->id,
            'entity_id' => $entity->id,
            'values' => [
                $field->id => json_encode(['v' => 'Contoh Nama', 'type' => 'Text'])
            ]
        ];

        // Request ke store-value
        $response = $this->postJson('/store-value', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Data created successfully'
            ]);

        $this->assertDatabaseHas('detail_values', [
            'entity_field_id' => $field->id,
            'value' => 'Contoh Nama'
        ]);
    }

    /** @test */
    public function it_can_update_entity_value_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create(['user_id' => $user->id]);
        $entity = ProjectEntity::factory()->create(['project_id' => $project->id]);
        $field = EntityField::factory()->create([
            'project_entity_id' => $entity->id,
            'title' => 'Nama',
            'type_id' => 1
        ]);

        // Simpan data awal
        $entityValue = EntityFieldValue::factory()->create([
            'project_entity_id' => $entity->id,
            'user_id' => $user->id
        ]);
        $entityValue->detailValues()->create([
            'entity_field_id' => $field->id,
            'value' => 'Nama Lama'
        ]);

        // Payload update
        $payload = [
            'values' => [
                $field->id => json_encode(['v' => 'Nama Baru', 'type' => 'Text'])
            ]
        ];

        $response = $this->postJson("/update-value/{$entityValue->id}", $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Data updated successfully'
            ]);

        $this->assertDatabaseHas('detail_values', [
            'entity_field_id' => $field->id,
            'value' => 'Nama Baru'
        ]);
    }
}
