import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useDeleteDataValue = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    const deleteDataValue = async (
        id: number,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsDeleting(true);
            await axios.delete(`/delete-value/${id}`);
            toast.success("Data deleted successfully");
            onSuccess?.();
        } catch (error: any) {
            setIsError(true);
            setError(error.message || "Failed to delete data");
            toast.error("Failed to delete data");
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteDataValue, isDeleting, isError, error };
};
