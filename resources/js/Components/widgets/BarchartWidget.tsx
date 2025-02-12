import { capitalizeWords } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip } from "recharts";



export function BarchartWidget({entity_id} : {entity_id : number | undefined}) {

    const [entity, setEntity] = useState<{
        name: string;
        value_count: number;
        chart_data : any[]
    } | null>(null);

    useEffect(() => {
        if (!entity_id) return;

        axios
            .get(`/list/get-entity-by-id/${entity_id}`)
            .then((res) => setEntity(res.data))
            .catch((err) => console.error("Error fetching entity:", err));
    }, [entity_id]);


    
    
    return (
        <div className="p-4 bg-white rounded-xl  w-full h-full">
            <h3 className="text-sm font-semibold text-center">{capitalizeWords(String(entity?.name))}</h3>
            <div className="w-full overflow-hidden flex justify-center items-center">
                <BarChart width={140} height={120} data={entity?.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={5}
                        tick={{ fontSize: 10 }} 
                    />
                    <Tooltip />
                    <Bar
                        dataKey="data"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </div>
        </div>
    );
}
