import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { MemberType } from "@/Pages/Users/Users";

const UserTable = ({ users }: { users: MemberType[] }) => {
    console.log(users);
    
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
                                
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default UserTable;
