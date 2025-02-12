<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;

class LoadCurrentProject
{
    public function handle(Request $request, Closure $next)
    {
        $uuid = $request->route('uuid');

        if ($uuid) {
            $currentProject = Project::with('entities')->where('uuid', $uuid)->firstOrFail();
            if ($currentProject) {
                Inertia::share('current_project', $currentProject);
            } 
        }

        return $next($request);
    }
}
