import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormSchema } from "@/lib/zod";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useCreateProject, useUpdateProject } from "@/stores/projectStore";
import { useEffect } from "react";

type ProjectSchema = z.infer<typeof ProjectFormSchema>;

type ProjectFormProps = {
    project?: {
        uuid: string;
        name: string;
        description: string;
    };
    onSuccess?: () => void;
    isEdit?: boolean;
};

const ProjectForm = ({
    project,
    onSuccess,
    isEdit = false,
}: ProjectFormProps) => {
    const { createProject, isLoading: creating } = useCreateProject();
    const { updateProject, isUpdating } = useUpdateProject();

    const form = useForm<ProjectSchema>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (isEdit && project) {
            form.reset({
                name: project.name,
                description: project.description,
            });
        }
    }, [isEdit, project, form]);

    const onSubmit = async (data: ProjectSchema) => {
        if (isEdit && project) {
            await updateProject(project.uuid, data, onSuccess);
        } else {
            await createProject(data, onSuccess);
        }
    };

    const busy = creating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Project Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="text-end">
                    <Button type="submit" size="sm" disabled={busy}>
                        {busy ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProjectForm;
