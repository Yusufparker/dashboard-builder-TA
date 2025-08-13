<?php

namespace App\Http\Controllers\Project;

use App\Models\Project;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function store(){
        try {
            DB::beginTransaction();
            $validatedData = request()->validate([
                'name' => 'required|string|min:5|max:50',
                'description' => 'required|string|min:5|max:255',
            ]);
    
            $project = Project::create([
                'uuid' => Str::uuid(),
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'user_id' => Auth::id(),
            ]);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Project created successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }

    }

    public function list()
    {
        $user = Auth::user();

        $ownedProjects = $user->projects;
        $sharedProjects = $user->sharedProjects;
        $allProjects = $ownedProjects->merge($sharedProjects)->unique('id')->values();

        return response()->json([
            'status' => 'success',
            'data' => $allProjects,
        ], 200);
    }



    public function delete($uuid)
    {
        try {

            $project = Project::where('uuid', $uuid)->firstOrFail();
            $project->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Project deleted successfully',
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function update($uuid)
    {
        try {
            $project = Project::where('uuid', $uuid)->firstOrFail();

            $validatedData = request()->validate([
                'name' => 'required|string|min:5|max:50',
                'description' => 'required|string|min:5|max:255',
            ]);

            $project->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Project updated successfully',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
