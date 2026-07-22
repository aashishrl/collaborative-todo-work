import { useState } from 'react';
import { HiPlus } from "react-icons/hi";

const Sidebar = ({addFileOpen, setAddFileOpen, files, selectedFileId, setSelectedFileId}) => {
    // const [fileSelected, setFileSelected] = useState(false);
    
    return (
        <aside className="h-[calc(100vh-80px)] w-80 bg-white rounded-lg shadow-sm">        
            <h1 className="p-3 px-5 text-xl font-semibold text-black text-center">
                Files
            </h1>
            <div className="flex flex-col">
              {files.length===0?(
                <div className="flex flex-col items-center gap-2 my-5">
                    <p className="text-text-muted text-center">No files, <br /> Add file to get started</p>
                    <button 
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-secondary
                                border border-border rounded-full cursor-pointer"
                        onClick={()=>setAddFileOpen(true)}
                    >
                        <HiPlus/>
                        Add File
                    </button>
                </div>
              ):(
                files.map((file, index)=>(
                    <button 
                        key={file.id}
                        className={`w-full px-4 py-2 text-left border-b border-b-border hover:bg-secondary
                             hover:text-white cursor-pointer duration-150
                            ${selectedFileId === file.id ? 'bg-secondary text-white' : ''}`

                            }
                        onClick={()=>setSelectedFileId(file.id)}
                    >
                        {file.name}
                    </button>
                ))
              )}  
                
            </div>
        </aside>
    )
}

export default Sidebar;