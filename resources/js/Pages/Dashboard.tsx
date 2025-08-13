import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/Components/ui/button";
import { PenTool } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import CardWidget from "@/Components/widgets/CardWidget";
import { BarchartWidget } from "@/Components/widgets/BarchartWidget";
import LinechartWidget from "@/Components/widgets/LinechartWidget";

type EntityType = {
    id: number;
    uuid: string;
    project_id: number;
    name: string;
    created_at: string;
};

type Widget = {
    id: number;
    entity?: EntityType;
    type: string;
    text?: string;
    textSize?: string;
    textBold?: boolean;
    layout?: string;
};

export default function Dashboard({ widgets }: { widgets: Widget[] }) {
    const current_project = usePage().props.current_project;
    const user = usePage().props.auth.user;

    const renderWidget = (item: Widget) => {
        switch (item.type) {
            case "card":
                return <CardWidget entity_id={item.entity?.id} />;
            case "barchart":
                return <BarchartWidget entity_id={item.entity?.id} />;
            case "linechart":
                return <LinechartWidget entity_id={item.entity?.id} />;
            case "text":
                return (
                    <>
                        <p
                            className={`${
                                item.textBold ? "font-bold" : ""
                            }  text-gray-700 text-center w-full`}
                            style={{
                                fontSize: `${item.textSize}px`,
                            }}
                        >
                            {item.text}
                        </p>
                    </>
                );
            default:
                return <p className="text-gray-500">Unknown Widget</p>;
        }
    };

    // Function to get responsive layout classes
    const getResponsiveLayout = (layout: string) => {
        switch (layout) {
            case "col-span-1":
                return "col-span-1 md:col-span-1"; // 1 column on all screens
            case "col-span-2":
                return "col-span-1 md:col-span-2"; // 1 column on mobile, 2 on desktop
            case "col-span-3":
                return "col-span-1 md:col-span-3"; // 1 column on mobile, 3 on desktop
            default:
                return "col-span-1";
        }
    };

    return (
        <DashboardLayout>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
                {widgets?.map((item) => (
                    <div
                        key={item.id}
                        className={`${getResponsiveLayout(
                            item?.layout || "col-span-1"
                        )} bg-white rounded-lg shadow border cursor-pointer h-40 flex items-center`}
                    >
                        {renderWidget(item)}
                    </div>
                ))}
                {current_project.user_id == user.id && (
                    <div className="col-span-1">
                        <Link
                            href={`/p/${current_project.uuid}/customize`}
                            className="w-full"
                        >
                            <Button className="w-full h-40 bg-white text-primary px-6 border border-primary border-dashed hover:bg-slate-200 py-3 transition flex items-center justify-center">
                                <PenTool />
                                <span className="ml-2">
                                    Customize Dashboard
                                </span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
