import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import KanbanBoard from "./dragndrop/AdvancedDragAndDrop";

function App() {

  return (
    <>
      {/* <KanbanBoard/> */}
      <Home/>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App