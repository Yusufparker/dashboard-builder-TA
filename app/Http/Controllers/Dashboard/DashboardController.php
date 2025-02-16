<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DashboardWidget;
use App\Models\Project;
use App\Models\ProjectEntity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index($uuid){
        $project = Project::where('uuid', $uuid)->firstOrFail();
        $widgets = DashboardWidget::where('project_id', $project->id)->first();

        if ($widgets) {
            $widgets->items = json_decode($widgets->items, true);
        }


        return Inertia::render('Dashboard',[
            'widgets' => $widgets ? $widgets->items : null
        ]);
    }

    public function customize($uuid){
        $project = Project::where('uuid', $uuid)->firstOrFail();
        if ($project->user_id != Auth::user()->id) {
            return redirect()->route('home');
        }
        $project_entity = ProjectEntity::where('project_id', $project->id)->get();
        $widgets = DashboardWidget::where('project_id', $project->id)->first();
        if (!$widgets) {
            $widgets = DashboardWidget::create([
                'project_id' => $project->id,
                'items' => json_encode([]) 
            ]);
        }
        $widgets->items = json_decode($widgets->items, true);

        
        return Inertia::render('EditDashboard', [
            'entities' => $project_entity,
            'widgets' => $widgets->items
        ]);
    }

}
