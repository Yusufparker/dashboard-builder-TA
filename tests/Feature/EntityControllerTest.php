<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EntityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Matikan semua middleware biar ga ke-block (CSRF, own.project, dll)
        $this->withoutMiddleware();
    }

    /** @test */
    public function it_can_create_entity_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $project = Project::factory()->create([
            'user_id' => $user->id
        ]);

        $payload = [
            'project_uuid' => $project->uuid,
            'entity_name' => 'Test Entity',
            'fields' => [
                [
                    'title' => 'Field 1',
                    'type_id' => 1,
                    'isRequired' => true
                ]
            ]
        ];
        $response = $this->postJson("/p/{$project->uuid}/entities/store", $payload);
        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Entity created successfully'
            ]);
        $this->assertDatabaseHas('project_entities', [
            'name' => strtolower($payload['entity_name']),
            'project_id' => $project->id
        ]);
    }

    /** @test */
    public function it_fails_if_entity_name_already_exists()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'user_id' => $user->id
        ]);

        // Buat entity pertama
        $this->postJson("/p/{$project->uuid}/entities/store", [
            'project_uuid' => $project->uuid,
            'entity_name' => 'Duplicate',
            'fields' => [
                ['title' => 'Field 1', 'type_id' => 1, 'isRequired' => true]
            ]
        ]);

        // Coba bikin entity dengan nama sama
        $response = $this->postJson("/p/{$project->uuid}/entities/store", [
            'project_uuid' => $project->uuid,
            'entity_name' => 'Duplicate',
            'fields' => [
                ['title' => 'Field 1', 'type_id' => 1, 'isRequired' => true]
            ]
        ]);

        $response->assertStatus(500) // karena di controller lempar Exception
            ->assertJson([
                'status' => 'error',
                'message' => "The entity name 'Duplicate' is already in use for this project."
            ]);
    }
    
}
