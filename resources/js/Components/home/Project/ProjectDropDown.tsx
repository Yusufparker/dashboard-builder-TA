import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useDeleteProject } from "@/stores/projectStore";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import ProjectForm from "./ProjectForm";

const ProjectDropDown = ({
    uuid,
    project,
}: {
    uuid: string;
    project: any; // sesuaikan tipenya kalau ada interface
}) => {
    const { deleteProject, isDeleting } = useDeleteProject();
    const [openDelete, setOpenDelete] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [openEdit, setOpenEdit] = useState(false);

    const handleDelete = async () => {
        await deleteProject(uuid, () => {
            window.location.reload();
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="absolute top-2 right-2 py-1 px-3 outline-none">
                    <EllipsisVertical className="w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-xs">
                    <DropdownMenuItem
                        onSelect={() => {
                            setOpenEdit(true);
                        }}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setOpenDelete(true)}
                        disabled={isDeleting}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update project details. Changes will reflect
                            immediately after saving.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <ProjectForm
                            project={project}
                            onSuccess={() => {
                                setOpenEdit(false);
                                // optionally refresh or emit event
                                window.location.reload();
                            }}
                            isEdit
                        />
                    </div>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button size="sm" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        <p className="text-sm mb-2">
                            Are you sure you want to delete this project? Type{" "}
                            <strong>DELETE</strong> to confirm.
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full border px-2 py-1 rounded text-sm"
                            placeholder="Type DELETE to confirm"
                        />
                    </div>
                    <DialogFooter className="mt-3 flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setOpenDelete(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            disabled={confirmText !== "DELETE" || isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProjectDropDown;
