import { z } from 'zod';
import {useForm} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormSchema } from '@/lib/zod';
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
import { useCreateProject } from '@/stores/projectStore';


type ProjectSchema = z.infer<typeof ProjectFormSchema>;



const ProjectForm = () => {
    const { createProject, isLoading, isError } = useCreateProject();
    const form = useForm<ProjectSchema>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data: ProjectSchema) => {
        await createProject(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <div className='text-end'>
                    <Button 
                        type="submit" 
                        size="sm"
                        disabled={isLoading}
                    >
                        Save
                    </Button>

                </div>
            </form>
        </Form>
    );
}

export default ProjectForm
