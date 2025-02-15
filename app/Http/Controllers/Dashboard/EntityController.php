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

    public function store(){
        try {
            DB::beginTransaction();
            $project_uuid = request('project_uuid');
            $entity_name = request('entity_name');
            $fields = request('fields');
            $project = Project::where('uuid', $project_uuid)->firstOrFail();

            $exists = ProjectEntity::where([
                ['project_id', '=', $project->id],
                ['name',
                    '=',
                    strtolower($entity_name)
                ]
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
                    'is_required' => $field['isRequired']
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

    public function storeValue()
    {
        try {
            DB::beginTransaction();

            $project_id = request('project_id');
            $entity_id = request('entity_id');
            $curent_project = Project::find($project_id);
            if (!$curent_project) {
                return response()->json(['message' => 'Project not found'], 404);
            }

            if (Auth::user()->id != $curent_project->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

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

            $project = Project::find($entity->project_id);
            if (Auth::user()->id != $project->user_id) {
                abort(403, 'Unauthorized action.');
            }

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
    

    public function getEntityValueAPI($endpoint){
        $setting = EntitySetting::where('endpoint', $endpoint)->firstOrFail();
        if($setting->is_api_enabled == 0){
            return response()->json([
                'status' => 'failed',
                'message' => 'unauthorize'
            ]);
        }

        $limit = request('limit', 5);
        $entity_detail = ProjectEntity::where('id', $setting->project_entity_id)
            ->with(['fields','setting'])
            ->firstOrFail();
    

        $entity_values = EntityFieldValue::where('project_entity_id', $entity_detail->id)
            ->with(['detailValues.field.type', 'user'])
            ->paginate($limit);

        $formatted_values = $entity_values->through(function ($item) {
            $fields = [
                'id' => $item->id,
                'user' =>  [
                    'id' => $item->user->id,
                    'name' => $item->user->name,
                ],
            ];
            foreach ($item->detailValues as $detail) {
                $field = $detail->field;
                if ($field) {
                    $fields[$field->title] = $field->type->name == 'Boolean' ?  (bool) $detail->value :  $detail->value;
                }
            }

            $fields['created_at'] = $item->created_at;

            return $fields;
        });

        return response()->json($formatted_values);
    }






}
