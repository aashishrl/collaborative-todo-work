import {useState, useEffect} from 'react';
import toast from "react-hot-toast";

const AddFile = ({addFileOpen, setAddFileOpen, setFiles}) => {
    const [fileName, setFileName] = useState("");
    // const [files, setFiles] = useState([]);

    if(!addFileOpen) return null;
    
    const handleFileSubmit = () => {
        if(!fileName.trim()) return;
        
        const newFile = {
            id: Date.now(),
            name: fileName,
            columns: [
                {
                    id: "todo",
                    title: "Todo",
                    tasks: []
                },
                {
                    id: "inprogress",
                    title: "In Progress",
                    tasks: []
                },
                {
                    id: "complete",
                    title: "Complete",
                    tasks: []
                }
            ]
        }
        
        setFiles(prev=> [...prev, newFile]);
        toast.success(`File ${fileName} added`);
        setFileName("");
        setAddFileOpen(false);
    }    
    
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-black">
          Add New File
        </h2>

        <div className="mb-6">
            <label
                htmlFor="fileName"
                className="mb-2 block text-sm font-medium text-text-muted"
            >
                File Name
            </label>

            <input
                id="fileName"
                type="text"
                placeholder="Enter file name"
                className="w-full rounded-md border border-border px-3 py-2 outline-none focus:border-black"
                value={fileName}
                onChange={(e)=>setFileName(e.target.value)}
            />
        </div>

        <div className="flex justify-end gap-3">
            <button
                className="rounded-md border border-border px-4 py-1.5 hover:bg-gray-100 cursor-pointer"
                onClick={()=>setAddFileOpen(false)}
            >
                Cancel
            </button>

            <button
                type='submit'
                className="rounded-md bg-primary px-4 py-1.5 text-white hover:bg-primary-dark duration-150 cursor-pointer"
                onClick={handleFileSubmit}
            >
                Add File
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddFile;