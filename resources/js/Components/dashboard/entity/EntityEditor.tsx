import {useState, useEffect} from  'react';
import { Button, buttonVariants } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/Components/ui/dialog";

import {Trash, Pencil} from 'lucide-react';
import { useGetTypes } from '@/stores/fieldTypeStore';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import FieldModal from './FieldModal';
import EditFieldModal from './EditFieldModal';
import { capitalizeWords } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";




export type FieldType = {
    title: string;
    slug: string;
    type_id: number | null;
    isRequired: boolean;
    defaultValue?: string;
    isReadOnly?: boolean;
};

const EntityEditor = () => {
    const project_uuid = usePage().props.current_project.uuid;
    const [name, setName] = useState<string>("Untitled");
    const {getFieldTypes, fieldTypes} = useGetTypes();
    const [fields, setFields] = useState<FieldType[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    
    const handleEditField = (index : number, editField : FieldType) => {
        setFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = editField;
            return updatedFields;
        });
        toast.success('Field updated')
    };
    const [newField, setNewField] = useState<FieldType>({
        title: "",
        slug: "",
        type_id: null,
        isRequired: false,
    });
    
    useEffect(() => {
        if (fieldTypes.length === 0) {
            getFieldTypes();
        }
    }, []);
    const handleAddField = () => {
        if (fields.some((field) => field.slug === newField.slug)) {
            alert("Field sudah ada! Harap gunakan slug yang berbeda.");
            return;
        }
        setFields((prevFields) => [...prevFields, { ...newField }]);
        setNewField({
            title: "",
            slug: "",
            type_id: null,
            isRequired: false,
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const payload = {
                project_uuid: project_uuid,
                entity_name: name,
                fields: fields,
            };
            console.log(fields);

            const response = await axios.post(`/p/${project_uuid}/entities/store`, payload);
            toast.success('Entity Created Successfully')
            window.location.href=`/p/${project_uuid}/entities/`;

            
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Netework Error')
            }
            
        } finally{
            setLoading(false)
        }
    };
    
    
    return (
        <div className="space-y-5">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">New Entity</h1>
                <div className="flex gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="border-[#4945FF] text-[#4945FF] text-xs"
                                variant="outline"
                            >
                                + Add another field
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[450px]">
                            <FieldModal newField={newField} setNewField={setNewField} handleAddField={handleAddField} fieldTypes={fieldTypes} />
                        </DialogContent>
                    </Dialog>

                    <Button 
                        className="text-xs" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {
                            loading ? (
                                <>
                                <svg className="mr-1 size-5 animate-spin border-4 border-transparent border-slate-400 border-t-white  rounded-full" viewBox="0 0 24 24"></svg>

                                Saving
                                </>
                            ) : (
                                'Save'
                            )
                        }
                    </Button>
                </div>
            </div>
            <div className="shadow rounded border p-4">
                <div>
                    <Label>Entity Name</Label>
                    <Input
                        placeholder="Entity Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mt-5 space-y-4">
                    <div className="flex font-bold text-sm p-4 bg-gray-100 border-b">
                        <div className="flex-1 w-[25%]">Field</div>
                        <div className="flex-1 w-[25%]">Type</div>
                        <div className="flex-1 w-[25%]">Required</div>
                        <div className="flex-1 text-center w-[25%]">
                            Actions
                        </div>
                    </div>
                    {
                        fields.map((field, index) =>(
                            <div key={index} className="flex items-center text-sm justify-between p-4 border rounded shadow-sm">
                                <div className="flex items-center space-x-2 w-[25%]">
                                    <div className="flex gap-3">
                                        <img
                                            src={
                                                fieldTypes?.find(
                                                    (f) => f.id === field.type_id
                                                )?.icon
                                            }
                                            alt=""
                                        />
                                        <span className="self-center">
                                            {capitalizeWords(field.title)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 w-[25%]">
                                    {
                                        fieldTypes?.find((f) => f.id === field.type_id)
                                            ?.name
                                    }
                                </div>
                                <div className="flex-1 w-[25%]">
                                    {field.isRequired && (
                                        <span className="text-xs text-orange-400 bg-orange-100 px-3 py-1 rounded">
                                            Required
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 text-center  w-[25%]">
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button
                                                variant="ghost"
                                                className='bg-red-300 py-4 me-1 rounded-full hover:bg-red-400'
                                                size='xs'
                                                
                                            >
                                                <Trash className="text-red-500" size={8} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. 
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className={
                                                    buttonVariants({
                                                        variant: "destructive"
                                                    })
                                                }
                                                onClick={() =>
                                                    setFields(
                                                        fields.filter((_, i) => i !== index)
                                                    )
                                                }
                                            >
                                                Delete
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className='bg-orange-300 py-4 rounded-full hover:bg-orange-400'
                                                size='xs'
                                            >
                                                <Pencil className="text-orange-500" size={8} />
                                            </Button>
                                        </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px]">
                                                <EditFieldModal index={index} field={field} fieldTypes={fieldTypes} handleEdit={handleEditField}/>
                                            </DialogContent>
                                    </Dialog>
                                
                                
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default EntityEditor
