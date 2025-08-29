import React from "react";
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

type PropsType = {
    newField: FieldType;
    setNewField: React.Dispatch<React.SetStateAction<FieldType>>;
    handleAddField: () => void;
    fieldTypes: { id: number; name: string }[];
};

const FieldModal: React.FC<PropsType> = ({
    newField,
    setNewField,
    handleAddField,
    fieldTypes,
}) => {
    const selectedFieldType = fieldTypes.find(
        (ft) => ft.id === newField.type_id
    );
    const fieldTypeName = selectedFieldType?.name?.toLowerCase() || "";
    
    return (
        <>
            <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>
                    Please enter the name for the new field.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-5">
                <div>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter Field Name"
                        value={newField.title}
                        onChange={(e) =>
                            setNewField((prevField) => ({
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
                        value={String(newField.type_id)}
                        onValueChange={(value) =>
                            setNewField((prevField) => ({
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

                {fieldTypeName === "dropdown" && (
                    <div>
                        <Label>Dropdown Options</Label>
                        <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                            {newField.options?.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                            const updatedOptions = [
                                                ...newField.options,
                                            ];
                                            updatedOptions[index] =
                                                e.target.value;
                                            setNewField((prevField) => ({
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
                                                newField?.options.filter(
                                                    (_, i) => i !== index
                                                );
                                            setNewField((prevField) => ({
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
                                setNewField((prevField) => ({
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
                        id="is-required"
                        checked={newField.isRequired}
                        onCheckedChange={(value) =>
                            setNewField((prevField) => ({
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
                    onClick={handleAddField}
                    disabled={!newField.title || newField.type_id === null}
                >
                    Add Field
                </Button>
            </div>
        </>
    );
};

export default FieldModal;
