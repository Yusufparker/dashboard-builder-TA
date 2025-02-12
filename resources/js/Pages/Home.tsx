
import HomeHeader from "@/Components/home/HomeHeader";
import ProjectList from "@/Components/home/Project/ProjectList";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";



export default function Home() {
    return (
        <AuthenticatedLayout>
            <Head title="Home" />
            <div className="px-6 lg:px-12 mt-10">
                <HomeHeader/>
                <hr className="my-10" />
                <ProjectList/>
            </div>
        </AuthenticatedLayout>
    );
}
