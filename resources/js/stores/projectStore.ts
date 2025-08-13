import axios from "axios";
import { ProjectFormSchema } from "@/lib/zod";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";

type ProjectType = z.infer<typeof ProjectFormSchema>;

export const useCreateProject = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const createProject = async (
        data: ProjectType,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsLoading(true);
            await axios.post("/project/store", data);
            toast.success("Project created successfully");
            onSuccess?.();
            window.location.reload();
        } catch (err: any) {
            setIsError(true);
            setError(err.message || "An error occurred");
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return { createProject, isLoading, isError, error };
};

export const useUpdateProject = () => {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const updateProject = async (
        uuid: string,
        data: ProjectType,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsUpdating(true);
            await axios.put(`/project/${uuid}`, data);
            toast.success("Project updated successfully");
            onSuccess?.();
        } catch (err: any) {
            setIsError(true);
            setError(err.message || "An error occurred");
            toast.error("Failed to update project");
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateProject, isUpdating, isError, error };
};

export const useGetProjects = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [projects, setProjects] = useState<any[]>([]);

    const getProjects = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/project/list");
            setProjects(response.data?.data || []);
        } catch (err: any) {
            setIsError(true);
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return { getProjects, isLoading, isError, error, projects };
};

export const useDeleteProject = () => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const deleteProject = async (
        uuid: string,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsDeleting(true);
            await axios.delete(`/project/${uuid}`);
            toast.success("Project deleted successfully");
            onSuccess?.();
        } catch (err: any) {
            setIsError(true);
            setError(err.message || "Failed to delete project");
            toast.error("Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteProject, isDeleting, isError, error };
};
