import { useEffect, useState } from "react";
import axios from "axios";
import { capitalizeWords } from "@/lib/utils";
import { BarChart3 } from "lucide-react"; 

const CardWidget = ({ entity_id }: { entity_id: number | undefined }) => {
    const [entity, setEntity] = useState<{
        name: string;
        value_count: number;
    } | null>(null);

    useEffect(() => {
        if (!entity_id) return;

        axios
            .get(`/list/get-entity-by-id/${entity_id}`)
            .then((res) => setEntity(res.data))
            .catch((err) => console.error("Error fetching entity:", err));
    }, [entity_id]);

    return (
        <div className="p-6 h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 ">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg shadow-md">
                    <BarChart3 size={18} />
                </div>
                <p className="text-sm font-medium text-gray-600">
                    {entity ? capitalizeWords(entity.name) : "Loading..."}
                </p>
            </div>

            <p className="text-4xl mt-5 font-extrabold text-gray-800 ">
                {entity ? entity.value_count : "0"}
            </p>
        </div>
    );
};

export default CardWidget;
