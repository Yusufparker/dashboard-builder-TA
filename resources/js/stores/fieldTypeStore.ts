import axios from "axios"
import {useState} from 'react';

type ResponseFieldType = {
    id : number;
    name : string;
    description : string;
    icon : string;

}

export const useGetTypes = () =>{
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [fieldTypes, setFieldTypes] = useState<ResponseFieldType[]>([]);

    const getFieldTypes = async () => {
        try {
            setisLoading(true);
            const response = await axios.get("/field-types/list");
            setFieldTypes(response.data?.data);
        } catch (error: any) {
            setIsError(true);
            setError(error.message || "An error occurred");
        } finally {
            setisLoading(false);
        }
    };

    return { getFieldTypes, isLoading, isError, error, fieldTypes };
}