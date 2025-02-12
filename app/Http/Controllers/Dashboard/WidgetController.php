<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DashboardWidget;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WidgetController extends Controller
{
    public function store(Request $request, $uuid)
    {

        $project = Project::where('uuid', $uuid)->firstOrFail();


        if (Auth::user()->id !== $project->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }


        $items = $request->input('items');

        DashboardWidget::updateOrCreate(
            ['project_id' => $project->id], 
            ['items' => json_encode($items)]
        );

        return response()->json(['message' => 'Dashboard saved successfully!'], 200);
    }
}
