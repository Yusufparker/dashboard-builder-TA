<?php

namespace App\Mail;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectInvitation extends Mailable
{
    use Queueable, SerializesModels;
    public Project $project;
    public string $inviteUrl;



    public function __construct(Project $project, string $inviteUrl)
    {
        $this->project = $project;
        $this->inviteUrl = $inviteUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Invitation to Join Project: {$this->project->name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content  
    {
        return new Content(
            view: 'emails.project-invitation',
            with: [
                'project' => $this->project,
                'inviteUrl' => $this->inviteUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
