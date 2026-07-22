import { useState } from "react";
import toast from "react-hot-toast";

const AddTask = ({
    addTaskOpen,
    setAddTaskOpen, 
    selectedFileId, 
    files, 
    setFiles}) => {
    const [taskTitle, setTaskTitle] = useState("");

    if (!addTaskOpen) return null;

    const handleTaskSubmit = () => {
        if(!taskTitle.trim()) return;
        
        const newTask = {
            id: Date.now(),
            column:"todo",
            name: taskTitle
        }

        setFiles(prev=>
            prev.map(file=>{
                if(file.id !== selectedFileId) return file;
                return {
                    ...file, 
                    columns: file.columns.map(column=>{
                        if(column.id !== "todo") return column;
                        return {
                            ...column,
                            tasks: [
                                ...column.tasks,
                                newTask
                            ]
                        }
                    })
                }
            })                
        )               
        setTaskTitle("");
        setAddTaskOpen(false)
        toast.success(`Task ${taskTitle} added`)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-xl font-semibold text-black">
                    Add New Task
                </h2>

                <div className="mb-6">
                    <label
                        htmlFor="taskTitle"
                        className="mb-2 block text-sm font-medium text-text-muted"
                    >
                        Task Title
                    </label>

                    <input
                        id="taskTitle"
                        type="text"
                        placeholder="Enter task title"
                        className="w-full rounded-md border border-border px-3 py-2 outline-none focus:border-black"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        className="cursor-pointer rounded-md border border-border px-4 py-1.5 hover:bg-gray-100"
                        onClick={() => setAddTaskOpen(false)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="cursor-pointer rounded-md bg-primary px-4 py-1.5 text-white duration-150 hover:bg-primary-dark"
                        onClick={handleTaskSubmit}
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTask;
