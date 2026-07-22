import { useState } from "react";
import AddTask from './AddTask';

const Board = ({selectedFileId, setSelectedFileId, setFiles, files}) => {
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    
    const selectedFile = files.find(
        file=> file.id === selectedFileId
    );
    const columns = [
        {
        title: "Todo",
        color: "bg-gray-100",
        tasks: [],
        },
        {
        title: "In Progress",
        color: "bg-blue-50",
        tasks: [],
        },
        {
        title: "Complete",
        color: "bg-green-50",
        tasks: [],
        },
    ];

  return (
    <>
    <main className="flex-1 p-6 border border-border rounded-lg bg-white">
        {selectedFileId?(
            <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h1 className="text-xl font-bold text-text-primary leading-tight">
                        {selectedFile.name}  Task Board
                        {/* Task Board */}
                    </h1>

                    <p className="text-sm text-text-secondary">
                        Manage and track your tasks
                    </p>
                    </div>

                    <button className="px-4 py-2 rounded-full bg-primary text-sm font-bold text-white
                      hover:bg-primary-dark focus:outline-none"
                      onClick={()=>setAddTaskOpen(true)}
                    >
                        + Add Task
                    </button>
                </div>

                {/* Board */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {selectedFile.columns.map((column) => (
                    <section
                        key={column.title}
                        className={`p-4 rounded-lg ${column.color} border border-border`}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-900">
                            {column.title}
                        </h2>

                        <span className="px-2 py-1 rounded-full bg-white text-xs text-gray-500 shadow-md">
                            {column.tasks.length}
                        </span>
                        </div>

                        {/* Tasks */}
                        <div className="flex flex-col gap-3">
                        {column.tasks.length === 0 ? (
                            <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-white 
                                text-sm text-gray-400 text-center"
                            >
                            No tasks
                            </div>
                        ) : (
                            column.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 rounded-lg bg-white shadow-md border-l-3 border-l-secondary"
                            >
                                <p className="text-sm text-gray-900">
                                {task.name}
                                </p>
                            </div>
                            ))
                        )}
                        </div>
                    </section>
                    ))}
                </div>
                
                <AddTask 
                    addTaskOpen={addTaskOpen}
                    setAddTaskOpen={setAddTaskOpen}
                    selectedFileId={selectedFileId}
                    files={files}
                    setFiles={setFiles}
                />
            </>
        ):(
        <div className="pt-20 text-text-muted text-center">
            Select File First
        </div>
        )}
        
    </main>
    </>
  );
};

export default Board;