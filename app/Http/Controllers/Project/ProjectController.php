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

    public function list(){
        $projects = Auth::user()->projects;
        return response()->json([
            'status' => 'success',
            'data' => $projects,
        ], 200);
    }
}
