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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { MemberType } from "@/Pages/Users/Users";
import { useMemberActions } from "@/stores/memberStore";
import { Trash } from "lucide-react";

const UserTable = ({
    users,
    project_uuid,
}: {
    users: MemberType[];
    project_uuid: string;
}) => {
    const { deleteMember, isDeleting } = useMemberActions(project_uuid);

    const handleDelete = async (email: string) => {
        await deleteMember(email, () => {
            window.location.reload(); // ⬅ atau trigger re-fetch, terserah kamu
        });
    };

    return (
        <Table className="text-sm w-full border border-gray-200 rounded-lg">
            <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {index + 1}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <span
                                    className={`py-0.5 px-2 text-xs rounded ${
                                        user.status === "pending"
                                            ? "bg-yellow-200 text-yellow-700"
                                            : "bg-green-200 text-green-700"
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-red-600 hover:text-red-800 me-2">
                                            <Trash size={15} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Delete User?
                                            </DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to delete
                                                this user? This action cannot be
                                                undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="secondary">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDelete(user.email)
                                                }
                                                disabled={isDeleting}
                                            >
                                                {isDeleting
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default UserTable;
