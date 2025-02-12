import axios from "axios";
import { ProjectFormSchema } from "@/lib/zod";
import { useState } from "react";
import {z}  from 'zod';
type ProjectType = z.infer<typeof ProjectFormSchema>;
import toast from "react-hot-toast";

export const useCreateProject = () => {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const createProject = async (data: ProjectType): Promise<void> => {
        try {
            setisLoading(true);
            await axios.post('/project/store', data);
            toast.success("Project created successfully");
            window.location.reload();
        } catch (error : any) {
            setIsError(true);
            setError(error.message || "An error occurred");
            toast.error("An error occurred");
        }finally{
            setisLoading(false)
        }
    };

    return  {createProject, isLoading, isError, error};
};

type ProjectResponseType = {
    id: number;
    uuid : string;
    name: string;
    description: string;
    user_id: number;
    created_at: Date;
}

export const useGetProjects = () => {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>(''); 
    const [projects, setProjects] = useState<ProjectResponseType[]>([]);

    const getProjects = async () => {
        try {
            setisLoading(true);
            const response = await axios.get('/project/list');
            setProjects(response.data?.data);
        } catch (error : any) {
            setIsError(true);
            setError(error.message || "An error occurred");
        }finally{
            setisLoading(false)
        }
    };

    return {getProjects, isLoading, isError, error, projects};
};