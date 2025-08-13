import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage } from "@inertiajs/react";
import { useState, useCallback } from "react";
import UserTable from "@/Components/dashboard/users/UserTable";
import { useMemberActions } from "@/stores/memberStore";

export type MemberType = {
    id: number;
    project_id: number;
    email: string;
    status: string;
    created_at: Date;
};

const Users = ({ users }: { users: MemberType[] }) => {
    const project_uuid = usePage().props.current_project.uuid;
    const { inviteMember, isInviting } = useMemberActions(project_uuid);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setError(
            !validateEmail(value) ? "Please enter a valid email address." : null
        );
    };

    const handleInvite = useCallback(async () => {
        if (!email || !validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        await inviteMember(email, () => {
            setEmail("");
            setError(null);
            window.location.reload();
        });
    }, [email, inviteMember]);

    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">Users</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">+ Add New</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Invite New User</DialogTitle>
                                <DialogDescription>
                                    Enter the user's email to send an
                                    invitation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="email" className="sr-only">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="example@mail.com"
                                        disabled={isInviting}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    size="sm"
                                    onClick={handleInvite}
                                    disabled={isInviting}
                                >
                                    {isInviting ? "Inviting..." : "Invite"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-10">
                    <UserTable users={users} project_uuid={project_uuid} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Users;
