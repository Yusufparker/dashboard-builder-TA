
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/Components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {  usePage } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import UserTable from "@/Components/dashboard/users/UserTable";

export type MemberType = {
    id : number;
    project_id : number;
    email : string;
    status : string;
    created_at : Date;


}

const Users = ({users} : {users : MemberType[]}) => {    
    const project_uuid = usePage().props.current_project.uuid;
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("Please enter a valid email address.");
        } else {
            setError(null);
        }
    };

    const handleInvite = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        try {
            const response = await axios.post(`/p/${project_uuid}/users/invite`,{
                email : email
            })
            console.log(response);
            
        } catch (error) {
            console.log(error);
            
        }
    };



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
                                    <Label htmlFor="link" className="sr-only">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="example@mail.com"
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
                                <Button size="sm" onClick={handleInvite}>Invite</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-10">
                    <UserTable users={users} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Users;
