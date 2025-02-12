import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const ProjectDropDown = ({ uuid }: { uuid: string }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 outline-none right-2  py-1 px-3">
                <EllipsisVertical className="w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-xs">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProjectDropDown;
