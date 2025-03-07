import EntitySettingForm from "@/Components/dashboard/entity/setting/EntitySettingForm";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link, usePage } from "@inertiajs/react";
import { MoveLeft } from "lucide-react";
export type SettingTytpe = {
    id : number;
    is_api_enabled : number,
    project_entity_id : number;
    endpoint : string
}


const Setting = ({setting}  : {setting : SettingTytpe}) => {
    const project_uuid = usePage().props.current_project.uuid;
    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <div className="mb-5">
                    <Link
                        href={`/p/${project_uuid}/entities`}
                        className="text-sm inline-flex items-center gap-2 mb-4 text-primary"
                    >
                        <MoveLeft size={10} />
                        back
                    </Link>
                    <h1 className="text-2xl font-bold">Entity Setting</h1>
                    
                </div>
                <EntitySettingForm setting={setting} />
            </div>
        </DashboardLayout>
    );
}

export default Setting
