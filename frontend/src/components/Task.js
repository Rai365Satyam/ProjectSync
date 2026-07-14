import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from './BtnPrimary'
import DropdownMenu from "./DropdownMenu";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown"
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";

// Restored all 4 Columns
const COLUMNS_MAP = {
    "requested": { id: "requested", name: "Requested" },
    "todo": { id: "todo", name: "To Do" },
    "ongoing": { id: "ongoing", name: "Ongoing" },
    "completed": { id: "completed", name: "Completed" }
};

function Task() {
    const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
    const [columns, setColumns] = useState({});
    const [isRenderChange, setRenderChange] = useState(false);
    const [isTaskOpen, setTaskOpen] = useState(false);
    const [taskId, setTaskId] = useState(false);
    const [title, setTitle] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]); 
    const { projectId } = useParams();
    const navigate = useNavigate();

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let data = {};

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            
            removed.stage = destColumn.name;
            destItems.splice(destination.index, 0, removed);

            const updatedColumns = {
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems }
            };

            setColumns(updatedColumns);
            data = updatedColumns;
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            
            copiedItems.splice(destination.index, 0, removed);
            
            const updatedColumns = {
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems }
            };

            setColumns(updatedColumns);
            data = updatedColumns;
        }

        updateTodo(data);
    };

    useEffect(() => {
        if (!isAddTaskModalOpen || isRenderChange) {
            axios.get(`http://localhost:9005/project/${projectId}`)
                .then((res) => {
                    if (res.data && res.data[0]) {
                        const project = res.data[0];
                        setTitle(project.title || '');
                        setAssignedUsers(project.assignedUsers || []);
                        
                        const tasks = project.task || [];
                        
                        // Distribute tasks across all 4 columns based on their stage
                        setColumns({
                            [COLUMNS_MAP.requested.id]: {
                                name: COLUMNS_MAP.requested.name,
                                items: tasks.filter((t) => t.stage === "Requested" || t.stage === "requested").sort((a, b) => a.order - b.order)
                            },
                            [COLUMNS_MAP.todo.id]: {
                                name: COLUMNS_MAP.todo.name,
                                items: tasks.filter((t) => t.stage === "To Do" || t.stage === "todo").sort((a, b) => a.order - b.order)
                            },
                            [COLUMNS_MAP.ongoing.id]: {
                                name: COLUMNS_MAP.ongoing.name,
                                items: tasks.filter((t) => t.stage === "Ongoing" || t.stage === "ongoing").sort((a, b) => a.order - b.order)
                            },
                            [COLUMNS_MAP.completed.id]: {
                                name: COLUMNS_MAP.completed.name,
                                items: tasks.filter((t) => t.stage === "Completed" || t.stage === "completed").sort((a, b) => a.order - b.order)
                            }
                        });
                    }
                    setRenderChange(false);
                }).catch(() => {
                    toast.error('Something went wrong');
                });
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);

    const updateTodo = (data) => {
        axios.put(`http://localhost:9005/project/${projectId}/todo`, data)
            .then(() => {})
            .catch(() => {
                toast.error('Something went wrong');
            });
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:9005/project/${projectId}/task/${id}`)
            .then(() => {
                toast.success('Task deleted successfully');
                setRenderChange(true);
            }).catch(() => {
                toast.error('Something went wrong');
            });
    };

    const handleTaskDetails = (id) => {
        setTaskId({ projectId, id });
        setTaskOpen(true);
    };

    // The handler now officially moves the task to the correct distinct column
    const handleStageDropdownChange = (item, targetStageValue) => {
        const updatedColumns = { ...columns };
        let foundItem = null;

        Object.keys(updatedColumns).forEach(colId => {
            updatedColumns[colId].items = updatedColumns[colId].items.filter(t => {
                if (t._id === item._id) {
                    foundItem = { ...t, stage: targetStageValue };
                    return false;
                }
                return true;
            });
        });

        if (foundItem) {
            // Find the matching column dynamically
            const targetKey = Object.keys(COLUMNS_MAP).find(
                key => COLUMNS_MAP[key].name.toLowerCase() === targetStageValue.toLowerCase()
            );

            if (targetKey && updatedColumns[targetKey]) {
                updatedColumns[targetKey].items.push(foundItem);
                updatedColumns[targetKey].items = updatedColumns[targetKey].items.map((t, index) => ({ ...t, order: index }));
            }
        }

        setColumns(updatedColumns);
        updateTodo(updatedColumns);
    };

    return (
        <div className='px-12 py-6 w-full bg-slate-50/50 min-h-screen font-sans antialiased'>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className='text-2xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight capitalize'>
                        <span>{title}</span>
                        <ProjectDropdown id={projectId} navigate={navigate} />
                    </h1>
                    
                    {assignedUsers.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Assigned Members:</span>
                            {assignedUsers.map((user, idx) => (
                                <span key={idx} className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm font-medium">
                                    👤 {user}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <BtnPrimary onClick={() => setAddTaskModal(true)}>Add task</BtnPrimary>
            </div>

            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {Object.entries(columns).map(([columnId, column]) => {
                        return (
                            <div className="w-[320px] shrink-0 bg-slate-100/70 p-4 rounded-2xl border border-slate-200/60" key={columnId}>
                                {/* Adjusted width to w-[320px] shrink-0 so all 4 columns fit well and scroll horizontally cleanly */}
                                <div className="pb-3 w-full flex justify-between items-center">
                                    <div className="inline-flex items-center space-x-2">
                                        <h2 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">{column.name}</h2>
                                        <span className={`h-6 px-2.5 inline-flex items-center justify-center text-xs font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-lg ${column.items.length < 1 && 'invisible'}`}>
                                            {column.items?.length}
                                        </span>
                                    </div>
                                </div>

                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`min-h-[500px] rounded-xl pt-2 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-indigo-50/40' : ''}`}
                                            >
                                                {column.items.map((item, index) => {
                                                    const currentStage = (item.stage || 'Requested').toLowerCase();
                                                    // Magic visual check: Is it in the Requested column?
                                                    const isRequested = currentStage === 'requested';
                                                    
                                                    return (
                                                        <Draggable key={item._id} draggableId={item._id} index={index}>
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{ ...provided.draggableProps.style }}
                                                                        onClick={() => handleTaskDetails(item._id)}
                                                                        className={`select-none p-5 mb-4 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-all duration-150 cursor-pointer group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/20' : 'shadow-md'}`}
                                                                    >
                                                                        <div className="flex flex-col gap-2">
                                                                            {/* 1. Username Section */}
                                                                            <div className="flex items-start justify-between gap-2">
                                                                                <h3 className="text-slate-900 font-extrabold text-base capitalize leading-snug">
                                                                                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest mb-0.5">
                                                                                        {isRequested ? "Requested By" : "Assigned User"}
                                                                                    </span>
                                                                                    👤 {item.title}
                                                                                </h3>
                                                                                <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} />
                                                                            </div>
                                                                            
                                                                            {/* 2. Content/Topic Section - ONLY displays if it is in To Do, Ongoing, or Completed! */}
                                                                            {!isRequested && item.description && (
                                                                                <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                                                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-widest mb-1">Task Content</span>
                                                                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                                                        {item.description}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            {/* Placeholder text while in Requested */}
                                                                            {isRequested && (
                                                                                <div className="mt-1 mb-2 p-2 rounded text-center">
                                                                                    <span className="text-[11px] text-slate-400 italic">Task details hidden until moved to To Do...</span>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {/* 3. The Massive Status Bar Switcher */}
                                                                            <div className="pt-4 mt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                                                                <select
                                                                                    value={item.stage || "Requested"}
                                                                                    onChange={(e) => handleStageDropdownChange(item, e.target.value)}
                                                                                    className={`w-full text-xs font-black uppercase tracking-widest px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-200 cursor-pointer text-center appearance-none shadow-sm ${
                                                                                        currentStage === 'completed' || currentStage === 'done'
                                                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-400'
                                                                                            : currentStage === 'ongoing' || currentStage === 'in progress'
                                                                                            ? 'bg-orange-100 text-orange-600 border-orange-400'
                                                                                            : currentStage === 'todo' || currentStage === 'to do'
                                                                                            ? 'bg-blue-50 text-blue-600 border-blue-300'
                                                                                            : 'bg-slate-100 text-slate-600 border-slate-300'
                                                                                    }`}
                                                                                >
                                                                                    <option value="Requested">STATUS: REQUESTED</option>
                                                                                    <option value="To Do">STATUS: TO DO (READY)</option>
                                                                                    <option value="Ongoing">STATUS: ONGOING</option>
                                                                                    <option value="Completed">STATUS: COMPLETED</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
            
            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} refreshData={setRenderChange} />
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
        </div>
    );
}

export default Task;