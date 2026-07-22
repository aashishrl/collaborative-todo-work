import { useState, useEffect } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddFile from "../components/AddFile";
import Board from "../board/Board";

const Home = () => {
    const [addFileOpen, setAddFileOpen] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [files, setFiles] = useState(()=>{
        const savedFiles = localStorage.getItem("files");

        return savedFiles ? JSON.parse(savedFiles):[];
    });
    // const [selectedFields, setSelectedFields] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);

    useEffect(()=>{
       localStorage.setItem("files", JSON.stringify(files))
    },[files])
    
    return (
        <section className="w-full max-w-300 mx-auto">
            <Header addFileOpen={addFileOpen} setAddFileOpen={setAddFileOpen}/>
            <section className="flex gap-4 mt-4">
                <Sidebar 
                    addFileOpen={addFileOpen} 
                    setAddFileOpen={setAddFileOpen} 
                    files={files}
                    selectedFileId={selectedFileId}
                    setSelectedFileId={setSelectedFileId}
                />
                <Board 
                    selectedFileId={selectedFileId} 
                    setSelectedFileId={setSelectedFileId}
                    setFiles={setFiles}
                    files={files}
                />
            </section>
            <AddFile addFileOpen={addFileOpen} setAddFileOpen={setAddFileOpen} setFiles={setFiles}/>            
        </section>
    )
}

export default Home;