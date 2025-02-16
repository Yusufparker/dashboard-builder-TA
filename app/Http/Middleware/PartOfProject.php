<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PartOfProject
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $uuid = $request->route('uuid');

        $project = Project::where('uuid', $uuid)
            ->with('members')
            ->firstOrFail();

        $userId = Auth::id();

        $isMember = $project->members->contains(
            fn($member) =>
            $member->user_id === $userId && $member->status === 'accepted'
        );

        if ($project->user_id == $userId || $isMember) {
            return $next($request);
        }

        abort(404, 'Project not found');
    }

}
