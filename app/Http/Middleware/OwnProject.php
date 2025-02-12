<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;

class OwnProject
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        $uuid = $request->route('uuid');


        $project = Project::where('uuid', $uuid)->firstOrFail();

        if ($project->user_id != Auth::id()) {
            abort(404, 'Project not found');
        }

        return $next($request);
    }
}
