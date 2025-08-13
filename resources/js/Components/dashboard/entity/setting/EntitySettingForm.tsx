import { useForm } from "react-hook-form";
import { useState } from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { SettingTytpe } from "@/Pages/Entities/Setting/Setting";
import { Clipboard } from "lucide-react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { RefreshCcw } from "lucide-react";

type DataPostType = {
    endpoint: string;
    is_api_enabled: boolean;
    api_key?: string;
};

const EntitySettingForm = ({ setting }: { setting: SettingTytpe }) => {
    const project_uuid = usePage().props.current_project.uuid;

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            is_api_enabled: Boolean(setting.is_api_enabled),
            endpoint: setting.endpoint,
            api_key: setting.api_key,
        },
    });

    const isApiEnabled = watch("is_api_enabled");
    const baseUrl = "http://localhost:8000/api/";
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const copyToClipboard = () => {
        const fullUrl = `${baseUrl}${watch("endpoint")}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Alternative API Key Generators
    const generateApiKey = () => {
        // Option 1: Random alphanumeric string (32 characters)
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

        // Option 2: Base64 random string
        const generateBase64 = (length = 24) => {
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            return btoa(String.fromCharCode(...array))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");
        };

        // Option 3: Hex string
        const generateHex = (length = 32) => {
            const array = new Uint8Array(length / 2);
            crypto.getRandomValues(array);
            return Array.from(array, (byte) =>
                byte.toString(16).padStart(2, "0")
            ).join("");
        };

        // Option 4: JWT-like format (header.payload.signature simulation)
        const generateJWTLike = () => {
            const header = generateBase64(8);
            const payload = generateBase64(16);
            const signature = generateBase64(12);
            return `${header}.${payload}.${signature}`;
        };

        // Option 5: API Key with prefix
        const generateWithPrefix = (prefix = "ak_") => {
            return prefix + generateAlphanumeric(28);
        };

        // Option 6: Timestamp + Random
        const generateTimestampBased = () => {
            const timestamp = Date.now().toString(36);
            const random = generateAlphanumeric(16);
            return `${timestamp}_${random}`;
        };

        // Choose your preferred method here:
        // return generateAlphanumeric(32);     // Option 1: Simple alphanumeric
        // return generateBase64(24);           // Option 2: Base64
        // return generateHex(32);              // Option 3: Hex
        // return generateJWTLike();            // Option 4: JWT-like
        return generateWithPrefix("ak_"); // Option 5: With prefix (recommended)
        // return generateTimestampBased();     // Option 6: Timestamp based
    };

    const onSubmit = async (data: DataPostType) => {
        await saveSetting(data);
    };

    const saveSetting = async (data: DataPostType) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `/p/${project_uuid}/entities/setting/store/${setting.id}`,
                {
                    is_api_enabled: data.is_api_enabled,
                    endpoint: data.endpoint,
                    api_key: data.api_key || "",
                }
            );
            if (response.data.status == "success") {
                toast.success(response.data.message);
                window.location.reload();
            } else {
                toast.error(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            toast.error("Failed");
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="p-1 text-gray-500 hover:text-gray-700"
                    >
                        <Clipboard className="w-5 h-5" />
                    </button>
                    {copied && (
                        <span className="text-green-500 text-xs">Copied!</span>
                    )}
                </div>
            </div>
            {isApiEnabled && (
                <div>
                    <Label>API Key</Label>
                    <div className="flex items-center space-x-2 text-sm">
                        <Input
                            {...register("api_key")}
                            disabled={true}
                            readOnly={true}
                            className="bg-gray-100 flex-1 text-sm cursor-not-allowed"
                            placeholder="Click generate to create API key"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const apiKey = generateApiKey();
                                setValue("api_key", apiKey);
                            }}
                            className="flex items-center space-x-1 p-1 text-gray-500 hover:text-gray-700"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span className="text-sm">Generate</span>
                        </button>
                    </div>
                </div>
            )}

            <Button type="submit" size="sm" disabled={loading}>
                Save Settings
            </Button>
        </form>
    );
};

export default EntitySettingForm;
