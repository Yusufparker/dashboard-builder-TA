<!DOCTYPE html>
<html>
<head>
    <title>Project Invitation</title>
</head>
<body>
    <h2>You're invited to join the project: {{ $project->name }}</h2>
    <p>Before accepting the invitation, please make sure you have an account.</p>
    <p>If you don't have an account, please <a href="{{ url('/register') }}">register here</a>.</p>
    <p>Once registered, click the link below to accept the invitation:</p>
    <a href="{{ $inviteUrl }}">{{ $inviteUrl }}</a>
</body>
</html>
