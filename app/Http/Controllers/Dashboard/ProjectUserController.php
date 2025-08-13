<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Mail\ProjectInvitation;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProjectUserController extends Controller
{
    public function  index($uuid){
        $project = Project::where('uuid', $uuid)->with('members')->first();
        return Inertia::render('Users/Users',[
            'users' => $project->members
        ]);
    }

    public function invite($uuid)
    {
        DB::beginTransaction(); // Mulai transaksi

        try {
            $data = request()->validate([
                'email' => ['required', 'string', 'email'],
            ]);

            $project = Project::where('uuid', $uuid)->firstOrFail();
            $user = User::where('email', $data['email'])->first();

            if ($user && ProjectMember::where('project_id', $project->id)->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'User is already a member'], 400);
            }

            $existingMember = ProjectMember::where('project_id', $project->id)
                ->where('email', $data['email'])
                ->exists();

            if ($existingMember) {
                return response()->json(['message' => 'User is already invited'], 400);
            }

            ProjectMember::create([
                'project_id' => $project->id,
                'user_id' => $user ? $user->id : null,
                'email' => $data['email'],
                'status' => 'pending',
            ]);

            $inviteUrl = url("/projects/{$project->uuid}/accept-invite?email={$data['email']}");

            // Kirim email undangan
            Mail::to($data['email'])->send(new ProjectInvitation($project, $inviteUrl));

            DB::commit(); // Commit jika semua proses berhasil

            return response()->json(['message' => 'Invitation sent successfully']);
        } catch (\Throwable $th) {
            DB::rollBack(); // Rollback jika terjadi error
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function acceptInvite($uuid){
        try {
            $user = Auth::user();
            $project = Project::where('uuid', $uuid)->firstOrFail();
            $member = ProjectMember::where('project_id', $project->id)->where('email', request('email'))->firstOrFail();
            $member->update([
                'user_id' => $user->id,
                'status' => 'accepted'
            ]);

            return redirect()->to('/p/'.$project->uuid);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }

        
    }

    public function delete($uuid, $email)
    {

        $project = Project::where('uuid', $uuid)->firstOrFail();
        $member = ProjectMember::where('project_id', $project->id)->where('email', $email)->first();
        
        if (!$member) {
            return response()->json(['message' => 'User not found in project'], 404);
        }

        $member->delete();

        return response()->json(['message' => 'User removed from project successfully']);
    }
}
