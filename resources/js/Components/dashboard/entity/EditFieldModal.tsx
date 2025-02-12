import React, { useState } from "react";
import { createSlug } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { FieldType } from "./EntityEditor";
const EditFieldModal = ({
        index,
        field,
        fieldTypes,
        handleEdit,
    }: {
        index: number;
        field: FieldType;
        fieldTypes: { id: number; name: string }[];
        handleEdit: (index: number, updatedField: FieldType) => void;
    }) => {
    const [editField, setEditField] = useState<FieldType>({
        title: field.title,
        slug: field.slug,
        type_id: field.type_id,
        isRequired: field.isRequired,
    });
    console.log(editField);

    return (
        <>
            <DialogHeader>
                <DialogTitle>EditField</DialogTitle>
                <DialogDescription>
                    Please enter the name for the new field.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter Field Name"
                        value={editField.title}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                title: e.target.value,
                                slug: createSlug(e.target.value),
                            }))
                        }
                    />
                </div>

                <div>
                    <Label>Type</Label>
                    <Select
                        value={String(editField.type_id)}
                        onValueChange={(value) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                type_id: Number(value),
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {fieldTypes?.map((fieldType) => (
                                <SelectItem
                                    key={fieldType.id}
                                    value={String(fieldType.id)}
                                >
                                    {fieldType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="is-required"
                        checked={editField.isRequired}
                        onCheckedChange={(value) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                isRequired: value,
                            }))
                        }
                    />
                    <Label htmlFor="is-required">Is Required</Label>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Close
                    </Button>
                </DialogClose>
                <Button
                    onClick={() => handleEdit(index, editField)}
                    disabled={!editField.title || editField.type_id === null}
                >
                    Save
                </Button>
            </div>
        </>
    );
};

export default EditFieldModal
