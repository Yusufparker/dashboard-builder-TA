import AuthenticatedLayout from "./AuthenticatedLayout";
import { PropsWithChildren, ReactNode, useState } from "react";
import {AlignJustify, Table2} from 'lucide-react'
import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboardIcon, Table2Icon } from "lucide-react";
import { capitalizeWords } from "@/lib/utils";


const DashboardLayout = ({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) => {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { current_project } = usePage().props;
    const user = usePage().props.auth.user;
    const renderMenuItems = () => (
        <>
            <ul>
                <li className="p-2">
                    <Link
                        href={`/p/${current_project.uuid}`}
                        className="hover:bg-[#E6E5FF]  rounded-[5px] py-3 px-5 text-sm flex items-center gap-4"
                    >
                        <div className="bg-primary p-1.5 rounded text-white">
                            <LayoutDashboardIcon size={16} />
                        </div>
                        Dashboard
                    </Link>
                </li>
            </ul>

            {current_project.user_id == user.id && (
                <ul>
                    <li className="p-2">
                        <Link
                            href={`/p/${current_project.uuid}/entities`}
                            className="hover:bg-[#E6E5FF]  rounded-[5px] py-3 px-5 text-sm flex items-center gap-4"
                        >
                            <div className="bg-primary p-1.5 rounded text-white">
                                <Table2Icon size={16} />
                            </div>
                            Entities
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link
                            href={`/p/${current_project.uuid}/users`}
                            className="hover:bg-[#E6E5FF]  rounded-[5px] py-3 px-5 text-sm flex items-center gap-4"
                        >
                            <div className="bg-primary p-1.5 rounded text-white">
                                <Table2Icon size={16} />
                            </div>
                            Users
                        </Link>
                    </li>
                </ul>
            )}

            <hr />

            <ul>
                {current_project.entities?.map((entity) => (
                    <li className="p-2" key={entity.id}>
                        <Link
                            href={`/p/${current_project.uuid}/table/${entity.uuid}`}
                            className="hover:bg-[#E6E5FF]  rounded-[5px] py-3 px-5 text-sm flex items-center gap-4"
                        >
                            <div className="bg-primary p-1.5 rounded text-white">
                                <Table2Icon size={16} />
                            </div>
                            {capitalizeWords(entity.name)}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );

    

    return (
        <AuthenticatedLayout>
            <div className="flex h-screen">
                {/* Sidebar for desktop */}
                <aside className="w-64 pb-14 border flex-shrink-0 hidden md:block overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <nav className="py-2">{renderMenuItems()}</nav>
                </aside>

                {/* Mobile Sidebar */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-50">
                        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 h-full">
                            <div className="p-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
                                Dashbuild
                                <button
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className="text-white focus:outline-none"
                                >
                                    <AlignJustify />
                                </button>
                            </div>
                            <nav className="py-2 px-2">{renderMenuItems()}</nav>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 pb-40 flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {/* Mobile Header */}
                    <div className="md:hidden p-4 flex items-center justify-between">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="focus:outline-none"
                        >
                            <AlignJustify size={15} />
                        </button>
                    </div>

                    {/* Content */}
                    <main className="p-4 flex-1">{children}</main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DashboardLayout;
