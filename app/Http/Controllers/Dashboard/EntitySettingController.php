<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\EntitySetting;
use App\Models\ProjectEntity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntitySettingController extends Controller
{
    public function index($project_uuid, $entity_uuid){
        $entity = ProjectEntity::where('uuid', $entity_uuid)->firstOrfail();
        $setting = EntitySetting::where('project_entity_id', $entity->id)->first();

        return response()->json([
            'status' => 'succcess',
            'setting' => $setting
        ]);

        return Inertia::render('Entities/Setting/Setting');
    }
}
