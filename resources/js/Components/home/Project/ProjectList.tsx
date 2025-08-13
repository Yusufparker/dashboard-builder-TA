import { useEffect } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { useGetProjects } from "@/stores/projectStore";
import ProjectDropDown from "./ProjectDropDown";
import { Link, usePage } from "@inertiajs/react";


const ProjectList = () => {
    const { projects, isLoading,getProjects } = useGetProjects();
    const user = usePage().props.auth.user;

    useEffect(() => {
        if (projects.length === 0) {
            getProjects();
        }
    }, []);
    


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
                <p>Loading...</p>
            ) : projects.length > 0 ? (
                projects.map((project, index) => (
                    <Card key={index}>
                        <CardHeader className="relative h-40">
                            {project.user_id === user.id && (
                                <div className="absolute top-2 right-2">
                                    <ProjectDropDown uuid={project.uuid} project={project}/>
                                </div>
                            )}
                            <CardTitle className="text-sm hover:underline">
                                <Link href={`/p/${project.uuid}`}>
                                    {project.name}
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))
            ) : (
                <p>No projects found</p>
            )}
        </div>
    );
};

export default ProjectList;
