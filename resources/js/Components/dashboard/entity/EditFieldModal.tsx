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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
        defaultValue: field.defaultValue || "",
        isReadOnly: field.isReadOnly || false,
        options: field.options || {},
    });

    const selectedFieldType = fieldTypes.find(
        (ft) => ft.id === editField.type_id
    );
    const fieldTypeName = selectedFieldType?.name?.toLowerCase() || "";

    const renderDefaultValueInput = () => {
        switch (fieldTypeName) {
            case "image":
            case "file":
                return (
                    <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        Default value is not applicable for {fieldTypeName}{" "}
                        fields.
                    </div>
                );

            case "boolean":
                // internal representation: "" means no default
                return (
                    <Select
                        value={
                            editField.defaultValue === "" ||
                            editField.defaultValue == null
                                ? undefined
                                : editField.defaultValue
                        }
                        onValueChange={(value) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: value === "none" ? "" : value,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Default Value" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Default</SelectItem>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                    </Select>
                );

            case "date":
                return (
                    <Input
                        type="date"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "datetime":
                return (
                    <Input
                        type="datetime-local"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "time":
                return (
                    <Input
                        type="time"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "number":
            case "integer":
                return (
                    <Input
                        type="number"
                        placeholder="Enter Default Number"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "email":
                return (
                    <Input
                        type="email"
                        placeholder="Enter Default Email"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "url":
                return (
                    <Input
                        type="url"
                        placeholder="Enter Default URL"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "textarea":
                return (
                    <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter Default Text"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );

            case "text":
            case "string":
            default:
                return (
                    <Input
                        type="text"
                        placeholder="Enter Default Value"
                        value={editField.defaultValue || ""}
                        onChange={(e) =>
                            setEditField((prevField) => ({
                                ...prevField,
                                defaultValue: e.target.value,
                            }))
                        }
                    />
                );
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogDescription>
                    Edit the field properties.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                    <div className="space-y-4 mt-5">
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
                                value={
                                    editField.type_id != null
                                        ? String(editField.type_id)
                                        : undefined
                                }
                                onValueChange={(value) =>
                                    setEditField((prevField) => ({
                                        ...prevField,
                                        type_id: Number(value),
                                        defaultValue: "",
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
                         {fieldTypeName === "dropdown" && (
                    <div>
                        <Label>Dropdown Options</Label>
                        <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                            {editField.options?.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                            const updatedOptions = [
                                                ...editField.options,
                                            ];
                                            updatedOptions[index] =
                                                e.target.value;
                                            setEditField((prevField) => ({
                                                ...prevField,
                                                options: updatedOptions,
                                            }));
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            const updatedOptions =
                                                editField?.options.filter(
                                                    (_, i) => i !== index
                                                );
                                            setEditField((prevField) => ({
                                                ...prevField,
                                                options: updatedOptions,
                                            }));
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            className="mt-3 w-full"
                            onClick={() =>
                                setEditField((prevField) => ({
                                    ...prevField,
                                    options: [...(prevField.options || []), ""],
                                }))
                            }
                        >
                            + Add Option
                        </Button>
                    </div>
                )}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is-required-edit"
                                checked={editField.isRequired}
                                onCheckedChange={(value) =>
                                    setEditField((prevField) => ({
                                        ...prevField,
                                        isRequired: value,
                                    }))
                                }
                            />
                            <Label htmlFor="is-required-edit">
                                Is Required
                            </Label>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="advanced">
                    <div className="space-y-4 mt-5">
                        <div>
                            <Label>Default Value</Label>
                            {renderDefaultValueInput()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is-readonly-edit"
                                checked={editField.isReadOnly || false}
                                onCheckedChange={(value) =>
                                    setEditField((prevField) => ({
                                        ...prevField,
                                        isReadOnly: value,
                                    }))
                                }
                            />
                            <Label htmlFor="is-readonly-edit">
                                Read-Only for Members
                            </Label>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

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

export default EditFieldModal;
