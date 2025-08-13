import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useMemberActions = (project_uuid: string) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    const deleteMember = async (
        email: string,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsDeleting(true);
            await axios.delete(`/p/${project_uuid}/users/${email}`);
            toast.success("Member deleted successfully");
            onSuccess?.();
        } catch (err: any) {
            setIsError(true);
            setError(err?.message || "Failed to delete member");
            toast.error("Failed to delete member");
        } finally {
            setIsDeleting(false);
        }
    };

    const inviteMember = async (
        email: string,
        onSuccess?: () => void
    ): Promise<void> => {
        try {
            setIsInviting(true);
            await axios.post(`/p/${project_uuid}/users/invite`, { email });
            toast.success("Invitation sent");
            onSuccess?.();
        } catch (err: any) {
            setIsError(true);
            setError(err?.message || "Failed to invite member");
            toast.error("Failed to invite member");
        } finally {
            setIsInviting(false);
        }
    };

    return {
        deleteMember,
        inviteMember,
        isDeleting,
        isInviting,
        isError,
        error,
    };
};
