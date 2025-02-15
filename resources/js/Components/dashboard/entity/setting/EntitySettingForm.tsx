import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const EntitySettingForm = () => {
    
    return (
        <div className="shadow rounded border p-4 space-y-4">
            <div className="items-top flex space-x-2">
                <Checkbox id="is_api_enabled" />
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
                <Input
                    disabled
                    className="disabled:bg-gray-100"
                />
            </div>
        </div>
    );
};

export default EntitySettingForm;
