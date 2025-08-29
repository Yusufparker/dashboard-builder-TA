<?php

namespace App\Http\Controllers\Dashboard;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProjectEntity;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\DetailValue;
use App\Models\EntityField;
use App\Models\EntityFieldValue;
use App\Models\EntitySetting;
use Illuminate\Http\UploadedFile;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class EntityController extends Controller
{
    public function index(){
        return Inertia::render('Entities/Entities');
    }

    public function create(){
        return Inertia::render('Entities/New');
    }

    public function store()
    {
        try {
            DB::beginTransaction();
            $project_uuid = request('project_uuid');
            $entity_name = request('entity_name');
            $fields = request('fields');
            $project = Project::where('uuid', $project_uuid)->firstOrFail();

            $exists = ProjectEntity::where([
                ['project_id', '=', $project->id],
                ['name', '=', strtolower($entity_name)]
            ])->exists();

            if ($exists) {
                throw new \Exception("The entity name '$entity_name' is already in use for this project.");
            }

            if (empty($fields) || !is_array($fields)) {
                throw new \Exception("Fields cannot be empty. Please provide at least one field.");
            }

            $entity = ProjectEntity::create([
                'uuid' => Str::uuid(),
                'name' => strtolower($entity_name),
                'project_id' => $project->id
            ]);

            $setting = EntitySetting::create([
                'project_entity_id' => $entity->id,
                'endpoint' => $entity->uuid,
                'is_api_enabled' => false
            ]);

            foreach ($fields as $field) {
                EntityField::create([
                    'project_entity_id' => $entity->id,
                    'title' => strtolower($field['title']),
                    'type_id' => $field['type_id'],
                    'is_required' => $field['isRequired'],
                    // Handle advanced fields
                    'options' => isset($field['options'])
                        ? implode(',', $field['options'])
                        : null,
                    'default_value' => $field['defaultValue'] ?? null,
                    'is_readonly' => $field['isReadOnly'] ?? false
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Entity created successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    public function entityTable($project_uuid, $entity_uuid)
    {
        $project = Project::where('uuid', $project_uuid)->first();
        $entity_detail = ProjectEntity::where('uuid', $entity_uuid)
            ->with('fields')
            ->firstOrFail();

        if ($project->id !== $entity_detail->project_id) {
            return abort(404);
        }

        $entity_values = EntityFieldValue::where('project_entity_id', $entity_detail->id)
            ->with('detailValues.field.type')
            ->paginate(5); 

        $formatted_values = $entity_values->through(function ($item) {
            $fields = [];
            foreach ($item->detailValues as $detail) {
                $field = $detail->field;
                if ($field) {
                    $fields[$field->title] = [
                        'v' => $detail->value,
                        'type' => $field->type->name
                    ];
                }
            }

            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'fields' => $fields,
            ];
        });



        return Inertia::render('Table/Table', [
            'entity_detail' => $entity_detail,
            'values' => $formatted_values
        ]);
    }

    public function destroy($project_uuid, $entity_uuid)
    {
        $project = Project::where('uuid', $project_uuid)->first();
        $entity = ProjectEntity::where('uuid', $entity_uuid)->firstOrFail();

        if ($project->id !== $entity->project_id) {
            return abort(404);
        }

        // Delete all values associated with the entity
        EntityFieldValue::where('project_entity_id', $entity->id)->delete();

        // Delete the entity itself
        $entity->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Entity deleted successfully',
        ], 200);
    }


    public function addNewValue($project_uuid, $entity_uuid){
        $project = Project::where('uuid', $project_uuid)->first();
        $entity_detail = ProjectEntity::where('uuid', $entity_uuid)
            ->with('fields.type')
            ->firstOrFail();
        if ($project->id !== $entity_detail->project_id) {
            return abort(404);
        }
        return Inertia::render('Table/New',[
            'entity_detail' => $entity_detail
        ]);
    }


    public function editValue($project_uuid, $entity_uuid, $id)
    {
        $project = Project::where('uuid', $project_uuid)->first();
        $entity_detail = ProjectEntity::where('uuid', $entity_uuid)
            ->with('fields.type')
            ->firstOrFail();

        if ($project->id !== $entity_detail->project_id) {
            return abort(404);
        }

        $value = EntityFieldValue::where('id', $id)
            ->with('detailValues.field.type')
            ->firstOrFail();

        $authUserId = Auth::id();

        $isOwner = $project->user_id === $authUserId;
        $isFiller = $value->user_id === $authUserId;

        if (!($isOwner || $isFiller)) {
            abort(403, 'You are not authorized to edit this value.');
        }

        return Inertia::render('Table/Edit', [
            'entity_detail' => $entity_detail,
            'value' => $value
        ]);
    }


    public function storeValue()
    {
        try {
            DB::beginTransaction();

            $project_id = request('project_id');
            $entity_id = request('entity_id');
            $curent_project = Project::where('id', $project_id)->with('members')->first();
            if (!$curent_project) {
                return response()->json(['message' => 'Project not found'], 404);
            }

            //start middleware
            $userId = Auth::user()->id;
            $isMember = $curent_project->members->contains(
                fn($member) =>
                $member->user_id === $userId && $member->status === 'accepted'
            );

            if ($userId != $curent_project->user_id && !$isMember) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            //end middleware

            $values = request('values');
            $files = request()->file('files');

            $entity_field_value = EntityFieldValue::create([
                'project_entity_id' => $entity_id,
                'user_id' => Auth::user()->id,
            ]);

            foreach ($values as $key => $json) {
                $data = json_decode($json, true); 
                $result_value = $data['v'];

                if ($data['type'] == 'Image' && isset($files[$key])) {
                    $result_value = $this->uploadImage($files[$key]);
                }

                DetailValue::create([
                    'entity_field_value_id' => $entity_field_value->id,
                    'entity_field_id' => $key,
                    'value' => $result_value
                ]);


                
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Data created successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function updateValue($id)
    {
        try {
            DB::beginTransaction();

            // Ambil data entity_field_value dan validasi keberadaannya
            $entity_field_value = EntityFieldValue::findOrFail($id);
            $entity_id = $entity_field_value->project_entity_id;

            // Ambil ProjectEntity dengan relasi project
            $curent_project = ProjectEntity::where('id', $entity_id)
                ->with('project') // pastikan relasi project tersedia
                ->first();

            if (!$curent_project || !$curent_project->project) {
                return response()->json(['message' => 'Project not found'], 404);
            }

            // Ambil data user
            if (!Auth::check()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            $userId = Auth::user()->id;
            $project = $curent_project->project;

            // Cek apakah user adalah owner atau pengisi data
            $isOwner = $project->user_id === $userId;
            $isFiller = $entity_field_value->user_id === $userId;

            if (!($isOwner || $isFiller)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Ambil data dari request
            $values = request('values');
            $files = request()->file('files');

            // Hapus nilai lama
            DetailValue::where('entity_field_value_id', $id)->delete();

            // Simpan ulang semua nilai
            foreach ($values as $key => $json) {
                $data = json_decode($json, true);
                $result_value = $data['v'];

                if ($data['type'] == 'Image' && isset($files[$key])) {
                    $result_value = $this->uploadImage($files[$key]);
                }

                DetailValue::create([
                    'entity_field_value_id' => $id,
                    'entity_field_id' => $key,
                    'value' => $result_value
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data updated successfully',
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }



    private function uploadImage($image)
    {
        $path = $image->store('images', 'public');
        return config('app.url') . '/storage/' . $path;
    }


    public function getEntityById($id)
    {
        try {
            $entity = ProjectEntity::where('id', $id)
                ->with('values')
                ->withCount('values')
                ->first();            
            if (!$entity) {
                return response()->json(['message' => 'Entity not found'], 404);
            }

            //start middleware
            $project = Project::where('id',$entity->project_id)->with('members')->first();
            $userId = Auth::user()->id;
            $isMember = $project->members->contains(
                fn($member) =>
                $member->user_id === $userId && $member->status === 'accepted'
            );

            if ($userId != $project->user_id && !$isMember) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            //end middleware

            date_default_timezone_set('Asia/Jakarta'); 
            // Format nama bulan
            $months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            $chartData = [];


            $currentMonth = (int) date('n'); 
            $last6Months = [];

            for ($i = 5; $i >= 0; $i--) {
                $monthIndex = ($currentMonth - $i - 1 + 12) % 12;
                $last6Months[] = $months[$monthIndex];
                $chartData[$months[$monthIndex]] = 0; 
            }

            foreach ($entity->values as $value) {
                $monthIndex = (int) date('n', strtotime($value->created_at)) - 1;
                $monthName = $months[$monthIndex];

                if (array_key_exists($monthName, $chartData)) { 
                    $chartData[$monthName]++;
                }
            }

            // Konversi ke array JSON
            $formattedChartData = [];
            foreach ($last6Months as $month) {
                $formattedChartData[] = [
                    'month' => $month,
                    'data' => $chartData[$month]
                ];
            }

            return response()->json([
                'name' => $entity->name,
                'chart_data' => $formattedChartData,
                'value_count' => $entity->values_count
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }


    public function getEntityValueAPI($endpoint)
    {
        $setting = EntitySetting::where('endpoint', $endpoint)->firstOrFail();

        // check is api enabled
        if (!$setting->is_api_enabled) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Unauthorized - API access is disabled'
            ], 403);
        }

        // allowed domains
        $allowedDomains = array_map('trim', explode(',', $setting->allowed_domains));

        // check allowrd domains
        $origin = request()->header('Origin') ?? request()->header('Referer');
        if ($origin && !empty($allowedDomains)) {
            $isAllowed = false;
            $originHost = parse_url($origin, PHP_URL_HOST);

            foreach ($allowedDomains as $domain) {
                // Hapus protokol & slash kalau ada
                $domain = preg_replace('#^https?://#', '', rtrim($domain, '/'));

                // Cocokkan host (case-insensitive)
                if (strcasecmp($originHost, $domain) === 0) {
                    $isAllowed = true;
                    break;
                }
            }

            if (!$isAllowed) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'Unauthorized - Domain not allowed'
                ], 403);
            }
        }


        //Cek API Key
        $requestApiKey = request()->header('X-API-KEY');
        if (!$requestApiKey || $requestApiKey !== $setting->api_key) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Unauthorized - Invalid API Key'
            ], 401);
        }


        $limit = request('limit', 5);
        $entity_detail = ProjectEntity::where('id', $setting->project_entity_id)
            ->with(['fields', 'setting'])
            ->firstOrFail();
        $entity_values = EntityFieldValue::where('project_entity_id', $entity_detail->id)
            ->with(['detailValues.field.type', 'user'])
            ->paginate($limit);

        $formatted_values = $entity_values->through(function ($item) {
            $fields = [
                'id' => $item->id,
                'user' => [
                    'id' => $item->user->id,
                    'name' => $item->user->name,
                ],
            ];

            foreach ($item->detailValues as $detail) {
                $field = $detail->field;
                if ($field) {
                    $fields[$field->title] = $field->type->name == 'Boolean'
                        ? (bool) $detail->value
                        : $detail->value;
                }
            }

            $fields['created_at'] = $item->created_at;
            return $fields;
        });

        return response()->json($formatted_values);
    }



    public function deleteValue($id)
    {
        try {
            // Ambil data entity_field_value dan validasi keberadaannya
            $entity_field_value = EntityFieldValue::findOrFail($id);
            $entity_id = $entity_field_value->project_entity_id;

            // Ambil ProjectEntity dengan relasi project
            $curent_project = ProjectEntity::where('id', $entity_id)
                ->with('project')
                ->first();

            if (!$curent_project || !$curent_project->project) {
                return response()->json(['message' => 'Project not found'], 404);
            }

            // Ambil user login
            if (!Auth::check()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            $userId = Auth::id();
            $project = $curent_project->project;

            // Validasi user sebagai owner atau pengisi data
            $isOwner = $project->user_id === $userId;
            $isFiller = $entity_field_value->user_id === $userId;

            if (!($isOwner || $isFiller)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            DB::beginTransaction();

            // Hapus detail value terlebih dahulu
            DetailValue::where('entity_field_value_id', $id)->delete();

            // Hapus entity_field_value
            $entity_field_value->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Value deleted successfully',
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
