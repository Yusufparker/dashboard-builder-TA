import EntityTable from '@/Components/dashboard/entity/EntityTable';
import { buttonVariants } from '@/Components/ui/button';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link, usePage } from '@inertiajs/react';
const Entities = () => {
    const project_uuid = usePage().props.current_project.uuid

    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">Entities</h1>
                    <Link 
                        href={`/p/${project_uuid}/entities/new`} 
                        className={buttonVariants({
                            size :'sm'
                        })}
                    >
                        + Add New
                    </Link>
                </div>
                <div className='mt-10'>
                    <EntityTable/>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Entities
