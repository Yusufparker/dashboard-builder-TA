<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\EntitySetting;
use App\Models\Project;
use App\Models\ProjectEntity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EntitySettingController extends Controller
{
    public function index($project_uuid, $entity_uuid){
        $entity = ProjectEntity::where('uuid', $entity_uuid)->firstOrfail();
        $setting = EntitySetting::where('project_entity_id', $entity->id)->first();

        // return response()->json([
        //     'status' => 'succcess',
        //     'setting' => $setting
        // ]);

        return Inertia::render('Entities/Setting/Setting',[
            'setting' => $setting
        ]);
    }

    public function store($project_uuid, $setting_id)
    {
        try {
            //code...
            $project = Project::where('uuid', $project_uuid)->firstOrFail();
    
            if (Auth::user()->id !== $project->user_id) {
                return abort(403);
            }
    
            $setting = EntitySetting::where('id', $setting_id)->firstOrFail();
    
            // Validasi request
            request()->validate([
                'is_api_enabled' => ['required', 'boolean'],
                'endpoint' => [
                    'required',
                    'string',
                    'unique:entity_settings,endpoint,' . $setting->id 
                ],
            ]);
    
            $setting->update([
                'is_api_enabled' => request('is_api_enabled'),
                'endpoint' => request('endpoint'),
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Entity Setting Updated Successfully!'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'failed',
                'message' => $th->getMessage()
            ]);
        }
    }

}
