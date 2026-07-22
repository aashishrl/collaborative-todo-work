import { HiPlus } from "react-icons/hi";

const Header = ({addFileOpen, setAddFileOpen}) => {
    return (
        <header 
            className="flex justify-between items-center w-full 
                mt-4 p-2 px-6 bg-white rounded-full shadow-sm"
        >
            <h1 className="text-3xl font-bold text-primary uppercase">Collab Board</h1>
            <button 
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white
                     bg-primary rounded-full cursor-pointer"
                onClick={()=>setAddFileOpen(true)}
            >
                <HiPlus/>
                Add File
            </button>
        </header>
    )
}

export default Header;