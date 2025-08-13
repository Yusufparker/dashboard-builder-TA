import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    SquareDashed,
    BarChart,
    Type,
    RectangleHorizontal,
    Edit,
    Trash2,
    X,
} from "lucide-react";
import CardWidget from "@/Components/widgets/CardWidget";
import { BarchartWidget } from "@/Components/widgets/BarchartWidget";
import LinechartWidget from "@/Components/widgets/LinechartWidget";
import { capitalizeWords } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

type EntityType = {
    id: number;
    uuid: string;
    project_id: number;
    name: string;
    created_at: string;
};

type Item = {
    id: number;
    entity?: EntityType;
    type: string;
    text?: string;
    textSize?: string;
    textBold?: boolean;
    layout?: string;
};

type DraggableCardProps = {
    item: Item;
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void;
};

let widgetTypeOption = [
    {
        type: "barchart",
        icon: <BarChart size={12} />,
    },
    {
        type: "card",
        icon: <SquareDashed size={12} />,
    },
    {
        type: "linechart",
        icon: <BarChart size={12} />,
    },
    {
        type: "text",
        icon: <Type size={12} />,
    },
];
const layoutOptions = [
    { value: "col-span-1", title: "small" },
    { value: "col-span-2", title: "medium" },
    { value: "col-span-3", title: "large" },
];

function DraggableCard({ item, onEdit, onDelete }: DraggableCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id });

    const [showActions, setShowActions] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderWidget = () => {
        switch (item.type) {
            case "card":
                return <CardWidget entity_id={item.entity?.id} />;
            case "barchart":
                return <BarchartWidget entity_id={item.entity?.id} />;
            case "linechart":
                return <LinechartWidget entity_id={item.entity?.id} />;
            case "text":
                return (
                    <>
                        <p
                            className={`${
                                item.textBold ? "font-bold" : ""
                            }  text-gray-700 text-center w-full`}
                            style={{
                                fontSize: `${item.textSize}px`,
                            }}
                        >
                            {item.text}
                        </p>
                    </>
                );
            default:
                return <p className="text-gray-500">Unknown Widget</p>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${item?.layout} bg-white rounded-lg shadow-sm border cursor-pointer h-40 flex items-center relative group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div
                {...attributes}
                {...listeners}
                className="w-full h-full flex items-center"
            >
                {renderWidget()}
            </div>

            {/* Action buttons */}
            {showActions && (
                <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-md shadow-md p-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                        }}
                    >
                        <Edit size={12} />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                    >
                        <Trash2 size={12} />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function EditDashboard({
    entities,
    widgets,
}: {
    entities: EntityType[];
    widgets: Item[];
}) {
    const [dashboardItems, setDashboardItems] = useState<Item[]>(widgets);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");
    const [textSize, setTextSize] = useState<string>("14");
    const [textBold, setTextBold] = useState<boolean>(false);
    const [selectedLayout, setSelectedLayout] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Edit state
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const project_uuid = usePage().props.current_project.uuid;

    console.log(dashboardItems);
    console.log(widgets);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = dashboardItems.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = dashboardItems.findIndex(
                (item) => item.id === over.id
            );
            setDashboardItems(arrayMove(dashboardItems, oldIndex, newIndex));
        }
    };

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        setIsEditing(true);
        setSelectedType(item.type);

        if (item.type === "text") {
            setInputText(item.text || "");
            setTextSize(item.textSize || "14");
            setTextBold(item.textBold || false);
        } else {
            setSelectedEntity(item.entity?.uuid || "");
        }
        setSelectedLayout(item.layout || "");
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setDashboardItems(dashboardItems.filter((item) => item.id !== id));
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingItem(null);
        setSelectedType(null);
        setSelectedEntity("");
        setInputText("");
        setTextSize("14");
        setTextBold(false);
        setSelectedLayout("");
    };

    const saveEdit = () => {
        if (!editingItem || !selectedType) return;

        const updatedItems = dashboardItems.map((item) => {
            if (item.id === editingItem.id) {
                if (selectedType === "text") {
                    return {
                        ...item,
                        text: inputText,
                        textSize,
                        textBold,
                        layout: selectedLayout,
                    };
                } else {
                    const entity = entities.find(
                        (e) => e.uuid === selectedEntity
                    );
                    return {
                        ...item,
                        entity,
                        type: selectedType,
                        layout: selectedLayout,
                    };
                }
            }
            return item;
        });

        setDashboardItems(updatedItems);
        cancelEdit();
    };

    const addEntity = () => {
        if (!selectedType) return;

        if (selectedType === "text") {
            if (inputText.trim() === "") return;
            setDashboardItems([
                ...dashboardItems,
                {
                    id: Date.now(),
                    type: "text",
                    text: inputText,
                    layout: selectedLayout,
                    textSize,
                    textBold,
                },
            ]);

            setInputText("");
            setTextSize("12");
            setTextBold(false);
        } else {
            const entity = entities.find((e) => e.uuid === selectedEntity);
            if (
                entity &&
                !dashboardItems.some(
                    (item) =>
                        item.entity?.uuid === entity.uuid &&
                        item.type === selectedType
                )
            ) {
                setDashboardItems([
                    ...dashboardItems,
                    {
                        id: Date.now(),
                        entity,
                        type: selectedType,
                        layout: selectedLayout,
                    },
                ]);
            }
        }

        // Reset form
        setSelectedType(null);
        setSelectedEntity("");
        setSelectedLayout("");
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `/p/${project_uuid}/customize/store`,
                {
                    items: dashboardItems,
                }
            );

            toast.success("Dashboard successfully updated!");
            window.location.href = `/p/${project_uuid}`;
        } catch (error) {
            console.error("Error saving dashboard:", error);
            toast.error("Failed to update the dashboard!");
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Customize Dashboard" />
            <div className="p-6">
                <div className="flex mt-4">
                    {/* Main Dashboard */}
                    <div className="flex-1 overflow-y-auto max-h-screen pb-52 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <div className="p-6 flex justify-between">
                            <h1 className="font-bold text-xl">
                                👋 Customize Your Dashboard Dashboard!
                            </h1>
                            <div className="flex gap-2">
                                <Link
                                    href={`/p/${project_uuid}`}
                                    className={buttonVariants({
                                        variant: "outline",
                                    })}
                                >
                                    Back
                                </Link>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "saving" : "Save"}
                                </Button>
                            </div>
                        </div>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={dashboardItems}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg min-h-[300px]">
                                    {dashboardItems.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center col-span-3 ">
                                            No items added
                                        </p>
                                    ) : (
                                        dashboardItems.map((item) => (
                                            <DraggableCard
                                                key={item.id}
                                                item={item}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Sidebar Navigation */}
                    <aside className="w-1/4 bg-white border p-4 rounded-lg flex flex-col items-center">
                        {isEditing && (
                            <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Edit Mode
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={cancelEdit}
                                    >
                                        <X size={12} />
                                    </Button>
                                </div>
                                <p className="text-xs text-blue-600">
                                    Editing: {editingItem?.type} widget
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                            {widgetTypeOption.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedType(option.type)}
                                    disabled={
                                        isEditing &&
                                        editingItem?.type !== option.type
                                    }
                                    className={`w-[62px] h-[62px] border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition ${
                                        selectedType === option.type
                                            ? "bg-gray-300"
                                            : "bg-white"
                                    } ${
                                        isEditing &&
                                        editingItem?.type !== option.type
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {option.icon}
                                    <span className="text-[10px] font-medium capitalize">
                                        {option.type}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {selectedType && (
                            <>
                                {selectedType === "text" ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter text"
                                            value={inputText}
                                            onChange={(e) =>
                                                setInputText(e.target.value)
                                            }
                                            className="w-full p-2 border text-xs rounded-lg mb-4"
                                        />
                                        <label className="block text-xs font-medium mb-1">
                                            Text Size
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter text size"
                                            value={textSize}
                                            onChange={(e) =>
                                                setTextSize(e.target.value)
                                            }
                                            className="w-full p-2 border text-xs rounded-lg mb-4"
                                        />

                                        <label className="flex items-center gap-2 text-xs mb-4">
                                            <input
                                                type="checkbox"
                                                checked={textBold}
                                                onChange={(e) =>
                                                    setTextBold(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            Bold
                                        </label>
                                    </>
                                ) : (
                                    <div className="mb-4 w-full mt-5">
                                        <label className="block text-xs font-medium mb-2">
                                            Select Entity
                                        </label>
                                        <select
                                            value={selectedEntity}
                                            onChange={(e) =>
                                                setSelectedEntity(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 border text-xs rounded-lg"
                                        >
                                            <option value="" disabled>
                                                Select an entity
                                            </option>
                                            {entities.map((entity) => (
                                                <option
                                                    key={entity.uuid}
                                                    value={entity.uuid}
                                                >
                                                    {entity.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-4 mt-3">
                                    {layoutOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedLayout(option.value)
                                            }
                                            className={`w-[62px] h-[62px] border flex flex-col justify-center items-center rounded-lg ${
                                                selectedLayout === option.value
                                                    ? "bg-gray-300"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <RectangleHorizontal size={14} />
                                            <span className="text-[10px] mt-2">
                                                {capitalizeWords(option.title)}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {isEditing ? (
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            onClick={saveEdit}
                                            className="flex-1"
                                            variant="default"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            onClick={cancelEdit}
                                            className="flex-1"
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={addEntity}
                                        className="w-full mt-2"
                                    >
                                        Add
                                    </Button>
                                )}
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
