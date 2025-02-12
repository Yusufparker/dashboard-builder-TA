import EntityEditor from "@/Components/dashboard/entity/EntityEditor";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Link, usePage } from "@inertiajs/react";
import {MoveLeft} from 'lucide-react';


const New = () => {
    const project_uuid = usePage().props.current_project.uuid;
    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <Link
                    href={`/p/${project_uuid}/entities`}
                    className="text-sm inline-flex items-center gap-2 mb-4 text-primary"
                >
                    <MoveLeft size={10} />
                    back
                </Link>
                <EntityEditor/>
            </div>
        </DashboardLayout>
    );
}

export default New
