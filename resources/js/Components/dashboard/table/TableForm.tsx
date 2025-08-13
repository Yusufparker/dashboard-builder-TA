import { FieldsType } from "@/Pages/Table/Table";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useEffect, useState } from "react";
import { capitalizeWords } from "@/lib/utils";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const TableForm = ({
    entity_id,
    fields,
    existingValue,
}: {
    fields: FieldsType[];
    entity_id: number;
    existingValue?: any;
}) => {
    const project_id = usePage().props.current_project.id;
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleInputChange = (
        fieldId: string,
        value: any,
        fieldType: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: {
                v: value,
                type: fieldType,
            },
        }));

        setErrors((prev) => ({
            ...prev,
            [fieldId]: "",
        }));
        if (fieldType === "Email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [fieldId]: "Invalid email format",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    [fieldId]: "",
                }));
            }
        }
    };
    useEffect(() => {
        if (existingValue) {
            const initialData: Record<string, any> = {};
            existingValue.detail_values.forEach((detail: any) => {
                const fieldTypeName = detail.field.type.name;
                let val = detail.value;

                if (fieldTypeName === "Boolean") {
                    // treat 1/"1"/true as true, else false
                    val = val === 1 || val === "1" || val === true;
                }

                initialData[String(detail.field.id)] = {
                    v: val,
                    type: fieldTypeName,
                };
            });
            setFormData(initialData);
            // console.log("Existing value loaded:", initialData);
        }
    }, [existingValue]);




    const handleSubmit = async () => {
        let formIsValid = true;
        let tempErrors: Record<string, string> = {};
        console.log(formData);

        fields.forEach((field) => {
            const fieldId = String(field.id);
            if (field.is_required && !formData[fieldId]) {
                formIsValid = false;
                tempErrors[fieldId] = "This field is required";
            }
            if (field.type.name === "Email" && formData[fieldId]?.v) {
                // Validasi email di handleSubmit
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[fieldId]?.v)) {
                    formIsValid = false;
                    tempErrors[fieldId] = "Invalid email format";
                }
            }
        });

        if (formIsValid) {
            if (existingValue) {
                await handleUpdateValue(existingValue.id);
            } else {
                await handleStoreValue();
            }
        } else {
            setErrors(tempErrors);
        }
    };
    const handleUpdateValue = async (id: number) => {
        const form = new FormData();

        for (const [key, data] of Object.entries(formData)) {
            if (data.type === "Image" && data.v instanceof File) {
                form.append(`files[${key}]`, data.v);
                form.append(
                    `values[${key}]`,
                    JSON.stringify({ v: "", type: data.type })
                );
            } else {
                form.append(
                    `values[${key}]`,
                    JSON.stringify({ v: data.v, type: data.type })
                );
            }
        }

        form.append("project_id", String(project_id));
        form.append("entity_id", String(entity_id));

        try {
            setLoading(true);
            const response = await axios.post(`/update-value/${id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 1100);
        } catch (error) {
            console.error("Error updating form:", error);
            toast.error("Failed to update data.");
            setLoading(false);
        }
        console.log("Form data updated:", formData);
        
    };

    const handleStoreValue = async () => {
        const form = new FormData();
        for (const [key, data] of Object.entries(formData)) {
            if (data.type === "Image" && data.v instanceof File) {
                //send as file
                form.append(`files[${key}]`, data.v);
                form.append(
                    `values[${key}]`,
                    JSON.stringify({ v: "", type: data.type })
                );
            } else {
                form.append(
                    `values[${key}]`,
                    JSON.stringify({ v: data.v, type: data.type })
                );
            }
        }

        form.append("project_id", String(project_id));
        form.append("entity_id", String(entity_id));

        try {
            setLoading(true);
            const response = await axios.post("/store-value", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(response.data.message);

            setTimeout(() => {
                window.location.reload();
            }, 1100);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                "Failed to add data. If the issue persists, please refresh the page."
            );
            setLoading(false);
        }
        console.log("Form data submitted:", formData);
        
    };

    return (
        <div>
            {fields.map((field) => (
                <div key={field.id} className="mb-4">
                    {field.type.name !== "Boolean" ? (
                        <Label
                            className="block text-sm font-semibold mb-1"
                            htmlFor={`field-${field.id}`}
                        >
                            {capitalizeWords(field.title)}
                            {field.is_required ? (
                                <span className="text-red-500">*</span>
                            ) : (
                                ""
                            )}
                        </Label>
                    ) : (
                        ""
                    )}
                    {renderInput(field, formData, handleInputChange, errors)}
                </div>
            ))}
            <Button disabled={loading} onClick={handleSubmit}>
                {loading ? (
                    <>
                        <svg
                            className="mr-1 size-5 animate-spin border-4 border-transparent border-slate-400 border-t-white  rounded-full"
                            viewBox="0 0 24 24"
                        ></svg>
                        Loading
                    </>
                ) : (
                    "Submit"
                )}
            </Button>
        </div>
    );
};

const renderInput = (
    field: FieldsType,
    formData: Record<string, any>,
    handleInputChange: (id: string, value: any, fieldType: string) => void,
    errors: Record<string, string>
) => {
    const fieldId = String(field.id);
    const value = formData[fieldId]?.v || "";
    const errorMessage = errors[fieldId];
    const page = usePage();
    const project = page.props.current_project;
    const user = page.props.auth.user;
    const isOwner = user?.id === project?.user_id;

    return (
        <div>
            {(() => {
                switch (field.type.name) {
                    case "Text":
                        return (
                            <Input
                                type="text"
                                id={`field-${field.id}`}
                                required={field.is_required}
                                value={value || field.default_value || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldId,
                                        e.target.value,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                            />
                        );
                    case "Number":
                        return (
                            <Input
                                type="number"
                                id={`field-${field.id}`}
                                required={field.is_required}
                                value={value || field.default_value || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldId,
                                        e.target.value,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                            />
                        );
                    case "Boolean": {
                        const raw = formData[fieldId]?.v;
                        const parseBool = (v: any) =>
                            String(v).trim().toLowerCase() === "true" ||
                            v === true;
                        const hasManual = raw !== undefined && raw !== null;
                        const isChecked = hasManual
                            ? Boolean(raw)
                            : parseBool(field.default_value);

                        return (
                            <div className="flex items-center gap-3">
                                <Input
                                    type="checkbox"
                                    id={`field-${field.id}`}
                                    className="h-6 w-5"
                                    checked={isChecked}
                                    onChange={(e) =>
                                        handleInputChange(
                                            fieldId,
                                            e.target.checked,
                                            field.type.name
                                        )
                                    }
                                    disabled={field.is_readonly && !isOwner}
                                />
                                <Label
                                    htmlFor={`field-${field.id}`}
                                    className="text-sm font-medium"
                                >
                                    {capitalizeWords(field.title)}
                                </Label>
                            </div>
                        );
                    }

                    case "Email":
                        return (
                            <Input
                                type="email"
                                id={`field-${field.id}`}
                                required={field.is_required}
                                value={value || field.default_value || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldId,
                                        e.target.value,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                            />
                        );
                    case "Date":
                        return (
                            <Input
                                type="date"
                                className="w-50"
                                id={`field-${field.id}`}
                                required={field.is_required}
                                value={value || field.default_value}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldId,
                                        e.target.value,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                            />
                        );

                    case "Image":
                        return (
                            <div key={field.id} className="mb-4">
                                <FilePond
                                    allowMultiple={false}
                                    acceptedFileTypes={["image/*"]}
                                    credits={false}
                                    onupdatefiles={(fileItems) => {
                                        const selectedFile =
                                            fileItems.length > 0
                                                ? fileItems[0].file
                                                : null;

                                        handleInputChange(
                                            fieldId,
                                            selectedFile,
                                            field.type.name
                                        );
                                    }}
                                    disabled={field.is_readonly && !isOwner}
                                />
                            </div>
                        );
                    case "Rich Text (Blocks)":
                        return (
                            <Editor
                                apiKey="pwlim18bd3c962waor0hcgke5x5fddqncranvj0ou1fjodjg"
                                value={value || field.default_value || ""}
                                onEditorChange={(content) =>
                                    handleInputChange(
                                        fieldId,
                                        content,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "help",
                                        "wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | formatselect | " +
                                        "bold italic backcolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                }}
                            />
                        );
                    default:
                        return (
                            <Input
                                type="text"
                                id={`field-${field.id}`}
                                required={field.is_required}
                                value={value || field.default_value || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldId,
                                        e.target.value,
                                        field.type.name
                                    )
                                }
                                disabled={field.is_readonly && !isOwner}
                            />
                        );
                }
            })()}
            {errorMessage && (
                <span className="text-red-500 text-xs">{errorMessage}</span>
            )}
        </div>
    );
};


export default TableForm;
