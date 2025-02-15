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

type DataPostType = {
    endpoint : string;
    is_api_enabled : boolean;
}

const EntitySettingForm = ({ setting }: { setting: SettingTytpe }) => {
    const project_uuid = usePage().props.current_project.uuid;

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            is_api_enabled: Boolean(setting.is_api_enabled),
            endpoint: setting.endpoint,
        },
    });

    const isApiEnabled = watch("is_api_enabled");
    const baseUrl = "http://localhost:8000/api/";
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const copyToClipboard = () => {
        const fullUrl = `${baseUrl}${watch("endpoint")}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onSubmit = async (data: DataPostType) => {
        await saveSetting(data)
    };


    const saveSetting = async (data : DataPostType) =>{
        try {
            setLoading(true)
            const response = await axios.post(`/p/${project_uuid}/entities/setting/store/${setting.id}`,{
                is_api_enabled : data.is_api_enabled,
                endpoint : data.endpoint
            });
            if(response.data.status == 'success'){
                toast.success(response.data.message)
                window.location.reload()
            }else{
                toast.error(response.data.message)
            }
            setLoading(false)
            
        } catch (error) {
            toast.error('Failed')
            setLoading(false)
            
        }
    }

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

            <Button
                type="submit"
                size="sm"
                disabled={loading}
            >
                Save Settings
            </Button>
        </form>
    );
};

export default EntitySettingForm;
