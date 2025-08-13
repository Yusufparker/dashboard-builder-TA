import { Button, buttonVariants } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { capitalizeWords } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { SquarePen, Trash } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { useDeleteDataValue } from "@/stores/dataValueStore";



export type EntityDetail = {
    id : number;
    uuid : string;
    name : string;
    created_at : Date;
    fields : FieldsType[]
}

export type FieldsType = {
    id : number;
    project_entity_id : number;
    title : string;
    type_id : number;
    is_required : boolean;
    created_at : Date;
    default_value : string | null;
    is_readonly : boolean;
    type : Type
}

type Type = {
    id : number;
    name : string;
}

type PaginatedData = {
    current_page: number;
    data: any[];
    from : number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url : string;
    path : string;
    per_page_url? : string;
    per_page: number;
    to: number;
    total: number;

}


const TableField = ({
    entity_detail,
    values,
}: {
    entity_detail: EntityDetail;
    values: PaginatedData;
}) => {
    const project = usePage().props.current_project;
    const project_uuid = project.uuid;
    const user = usePage().props.auth.user;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const filteredData = values.data.filter((v) =>
        entity_detail.fields.some((field) =>
            v.fields[field.title]?.v
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );
    const { deleteDataValue, isDeleting } = useDeleteDataValue();


    const handleDelete = async (id:number) => {
        await deleteDataValue(id, () => {
            window.location.reload();
        });
    };

    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">
                        {capitalizeWords(entity_detail.name)}
                    </h1>
                    <Link
                        href={`/p/${project_uuid}/table/${entity_detail.uuid}/new`}
                        className={buttonVariants({ size: "sm" })}
                    >
                        + Add New
                    </Link>
                </div>

                {/* Input Search */}
                <div className="mt-4 mb-2">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="mt-4 overflow-x-auto">
                    <Table className="text-xs min-w-full border border-gray-200 rounded-lg">
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                {entity_detail.fields?.map((field) => (
                                    <TableHead
                                        key={field.id}
                                        className="font-semibold"
                                    >
                                        {capitalizeWords(field.title)}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right font-semibold">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((v) => (
                                    <TableRow
                                        key={v.id}
                                        className="hover:bg-gray-50"
                                    >
                                        {entity_detail.fields?.map((field) => {
                                            let fieldValue =
                                                v.fields[field.title]?.v;
                                            let fieldType =
                                                v.fields[field.title]?.type;

                                            return (
                                                <TableCell
                                                    key={field.title}
                                                    className="py-2 px-4"
                                                >
                                                    {fieldType === "Image" &&
                                                    fieldValue ? (
                                                        <img
                                                            src={fieldValue}
                                                            alt="Uploaded"
                                                            className="w-16 h-16 object-cover rounded border"
                                                        />
                                                    ) : fieldType ===
                                                      "Boolean" ? (
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${
                                                                fieldValue == 1
                                                                    ? "bg-green-100 text-green-600"
                                                                    : "bg-red-100 text-red-600"
                                                            }`}
                                                        >
                                                            {fieldValue == 1
                                                                ? "Yes"
                                                                : "No"}
                                                        </span>
                                                    ) : fieldType ===
                                                      "Email" ? (
                                                        <a
                                                            href={`mailto:${fieldValue}`}
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            {fieldValue}
                                                        </a>
                                                    ) : fieldType ===
                                                      "Rich Text (Blocks)" ? (
                                                        <div
                                                            className="max-w-xs text-xs line-clamp-2 overflow-hidden text-ellipsis"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    fieldValue ||
                                                                    "-",
                                                            }}
                                                        />
                                                    ) : (
                                                        fieldValue || "-"
                                                    )}
                                                </TableCell>
                                            );
                                        })}

                                        {/* edit button */}
                                        <TableCell>
                                            <div className="flex justify-end px-2">
                                                {(v.user_id === user.id ||
                                                    project.user_id ===
                                                        user.id) && (
                                                    <>
                                                        {/* delete  button */}
                                                        <Dialog>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <button className="text-red-600 hover:text-red-800 me-2">
                                                                    <Trash
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Delete
                                                                        Data?
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        data?
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose
                                                                        asChild
                                                                    >
                                                                        <Button variant="secondary">
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>

                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                v.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isDeleting
                                                                        }
                                                                    >
                                                                        {isDeleting
                                                                            ? "Deleting..."
                                                                            : "Delete"}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Link
                                                            href={`/p/${project.uuid}/table/${entity_detail.uuid}/edit/${v.id}`}
                                                            className="text-orange-600 hover:text-orange-800"
                                                        >
                                                            <SquarePen
                                                                size={15}
                                                            />
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            entity_detail.fields.length + 1
                                        }
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] text-gray-600">
                        Showing {values.from || 0} to {values.to} of{" "}
                        {values.total} entries
                    </span>
                    <div className="flex space-x-1">
                        {values.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-3 py-2 text-[10px] rounded-md border ${
                                    link.active
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                } ${
                                    !link.url
                                        ? "pointer-events-none text-gray-400"
                                        : ""
                                }`}
                            >
                                {link.label
                                    .replace("&laquo;", "«")
                                    .replace("&raquo;", "»")}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TableField;

