import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { capitalizeWords } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EntityTable = () => {
    const entities = usePage().props.current_project.entities;
    const project_uuid = usePage().props.current_project.uuid;

    const [open, setOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [confirmText, setConfirmText] = useState("");
    const isConfirm = confirmText === "DELETE";

    const handleDelete = useCallback(async () => {
        if (!selectedEntity || !isConfirm) return;
        try {
            await axios.delete(
                `/p/${project_uuid}/entities/${selectedEntity.uuid}`
            );
            toast.success("Entity deleted");
            setOpen(false);
            setConfirmText("");
            setSelectedEntity(null);
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete entity");
        }
    }, [project_uuid, selectedEntity, isConfirm]);

    return (
        <>
            <Table className="text-sm w-full border border-gray-200 rounded-lg">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="w-[30%] font-semibold">
                            Name
                        </TableHead>
                        <TableHead className="font-semibold">
                            Created At
                        </TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entities?.map((entity: any, index: number) => (
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
                                        <EllipsisVertical size={14} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="text-xs">
                                            Options
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs">
                                            <Link
                                                href={`/p/${project_uuid}/entities/setting/${entity.uuid}`}
                                            >
                                                Setting
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-xs text-red-600"
                                            onSelect={() => {
                                                setSelectedEntity(entity);
                                                setConfirmText("");
                                                setOpen(true);
                                            }}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            To delete{" "}
                            <strong>
                                {capitalizeWords(selectedEntity?.name || "")}
                            </strong>
                            , type <code>DELETE</code> below. This cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2">
                        <Input
                            placeholder="DELETE"
                            value={confirmText}
                            onChange={(e) =>
                                setConfirmText(e.target.value.trim())
                            }
                            className="text-sm"
                        />
                    </div>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button size="sm" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            size="sm"
                            variant="destructive"
                            disabled={!isConfirm}
                            onClick={handleDelete}
                        >
                            {isConfirm ? "Delete" : "Type DELETE"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EntityTable;
