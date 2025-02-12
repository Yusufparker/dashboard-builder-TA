import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import { Link, usePage } from "@inertiajs/react";
import { capitalizeWords } from "@/lib/utils";
import {EllipsisVertical} from "lucide-react"


const EntityTable = () => {
    const entities = usePage().props.current_project.entities;
    const project_uuid = usePage().props.current_project.uuid;
    
    return (
        <Table className="text-sm w-full border border-gray-200 rounded-lg">
            <TableHeader className="bg-gray-100">
                <TableRow>
                    <TableHead className="w-[30%] font-semibold">
                        Name
                    </TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {entities?.map((entity, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-4">
                            {capitalizeWords(entity.name)}
                        </TableCell>
                        <TableCell className="py-2 px-4">
                            {new Date(entity.created_at).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <EllipsisVertical size={10} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel className="text-xs">
                                        Options
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs" >
                                        <Link href={`/p/${project_uuid}/entities/setting/${entity.uuid}`}>
                                            Setting
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs">Edit</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default EntityTable
