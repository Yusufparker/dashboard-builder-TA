import { capitalizeWords } from "@/lib/utils";
import axios from "axios";
import { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, Tooltip } from "recharts";

const LinechartWidget = ({ entity_id }: { entity_id: number | undefined }) => {
    const [entity, setEntity] = useState<{
        name: string;
        value_count: number;
        chart_data: any[];
    } | null>(null);

    useEffect(() => {
        if (!entity_id) return;

        axios
            .get(`/list/get-entity-by-id/${entity_id}`)
            .then((res) => setEntity(res.data))
            .catch((err) => console.error("Error fetching entity:", err));
    }, [entity_id]);

    return (
        <div className="p-4 bg-white rounded-xl w-full h-full">
            <h3 className="text-sm font-semibold text-center">
                {capitalizeWords(String(entity?.name))}
            </h3>
            <div className="w-full overflow-hidden flex justify-center items-center">
                <LineChart
                    width={140}
                    height={120}
                    data={entity?.chart_data || []}
                    margin={{ left: 12, right: 12 }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={5}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <Tooltip />
                    <Line
                        dataKey="data"
                        type="monotone"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </div>
        </div>
    );
};

export default LinechartWidget;
