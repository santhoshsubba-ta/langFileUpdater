import DataProcessorWrapper from "./pages/DataProcessorWrapper"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Home} from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/process" element={<DataProcessorWrapper />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
