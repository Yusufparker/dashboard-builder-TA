import DashboardLayout from "@/Layouts/DashboardLayout";
import { EntityDetail } from "./Table";
import TableForm from "@/Components/dashboard/table/TableForm";

const Edit = ({ entity_detail, value }: { entity_detail: EntityDetail, value : any }) => {
    return (
        <DashboardLayout>
            <div className="ps-2 pe-7">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">
                        Edit {entity_detail.name}
                    </h1>
                </div>
                <div className="mt-6">
                    <TableForm
                        entity_id={entity_detail.id}
                        fields={entity_detail.fields}
                        existingValue={value}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Edit;
