import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { SettingTytpe } from "@/Pages/Entities/Setting/Setting";
import { Clipboard, RefreshCcw, Plus, Trash } from "lucide-react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";

type DataPostType = {
    endpoint: string;
    is_api_enabled: boolean;
    api_key?: string;
    allowed_domains: { value: string }[]; // array untuk multiple input
};

const EntitySettingForm = ({ setting }: { setting: SettingTytpe }) => {
    const project_uuid = usePage().props.current_project.uuid;

    const { register, handleSubmit, watch, setValue, control } =
        useForm<DataPostType>({
            defaultValues: {
                is_api_enabled: Boolean(setting.is_api_enabled),
                endpoint: setting.endpoint,
                api_key: setting.api_key,
                allowed_domains: (setting.allowed_domains || "")
                    .split(",")
                    .filter(Boolean)
                    .map((d) => ({ value: d.trim() })),
            },
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowed_domains",
    });

    const isApiEnabled = watch("is_api_enabled");
    const baseUrl = "https://dashbuild.berkabarindonesia.com/api/";
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const copyToClipboard = () => {
        const fullUrl = `${baseUrl}${watch("endpoint")}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateApiKey = () => {
        const generateAlphanumeric = (length = 32) => {
            const chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            for (let i = 0; i < length; i++) {
                result += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                );
            }
            return result;
        };
        return "ak_" + generateAlphanumeric(28);
    };

    const onSubmit = async (data: DataPostType) => {
        // Konversi array domains menjadi string yang dipisah koma
        const domainString = data.allowed_domains
            .map((d) => d.value.trim())
            .filter(Boolean) // hilangkan yang kosong
            .join(",");

        // Debug log untuk memastikan data yang dikirim
        console.log("Data yang akan dikirim:", {
            is_api_enabled: data.is_api_enabled,
            endpoint: data.endpoint,
            api_key: data.api_key,
            allowed_domains: domainString,
        });

        // Kirim data ke backend
        await saveSetting({
            is_api_enabled: data.is_api_enabled,
            endpoint: data.endpoint,
            api_key: data.api_key,
            allowed_domains: domainString || "", // pastikan tidak undefined
        });
    };

    const saveSetting = async (data: any) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `/p/${project_uuid}/entities/setting/store/${setting.id}`,
                data
            );
            if (response.data.status == "success") {
                toast.success(response.data.message);
                window.location.reload();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed");
            console.error("Error saving setting:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="shadow rounded border p-4 space-y-4"
        >
            <div className="items-top flex space-x-2">
                <Checkbox
                    id="is_api_enabled"
                    checked={isApiEnabled}
                    onCheckedChange={(checked) =>
                        setValue("is_api_enabled", !!checked)
                    }
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="is_api_enabled"
                        className="text-sm font-medium"
                    >
                        Enable API
                    </label>
                    <p className="text-sm text-muted-foreground">
                        Allow API access to share data with other systems
                    </p>
                </div>
            </div>

            <div>
                <Label>Endpoint</Label>
                <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">{baseUrl}</span>
                    <Input
                        {...register("endpoint")}
                        disabled={!isApiEnabled}
                        className="disabled:bg-gray-100 flex-1 text-sm"
                    />
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        disabled={!isApiEnabled}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        <Clipboard className="w-5 h-5" />
                    </button>
                    {copied && (
                        <span className="text-green-500 text-xs">Copied!</span>
                    )}
                </div>
            </div>

            {isApiEnabled && (
                <>
                    <div>
                        <Label>API Key</Label>
                        <div className="flex items-center space-x-2 text-sm">
                            <Input
                                {...register("api_key")}
                                disabled
                                readOnly
                                className="bg-gray-100 flex-1 text-sm"
                                placeholder="Click generate to create API key"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setValue("api_key", generateApiKey())
                                }
                                className="flex items-center space-x-1 p-1 text-gray-500 hover:text-gray-700"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                <span className="text-sm">Generate</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label>Allowed Domains</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Add domains that are allowed to access this API
                            endpoint
                        </p>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex space-x-2 mb-2">
                                <Input
                                    {...register(
                                        `allowed_domains.${index}.value` as const
                                    )}
                                    placeholder="example.com"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => append({ value: "" })}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Domain
                        </Button>

                        {fields.length === 0 && (
                            <p className="text-sm text-gray-400 mt-2">
                                No domains added. Click "Add Domain" to allow
                                specific domains.
                            </p>
                        )}
                    </div>
                </>
            )}

            <Button type="submit" size="sm" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
            </Button>
        </form>
    );
};

export default EntitySettingForm;
