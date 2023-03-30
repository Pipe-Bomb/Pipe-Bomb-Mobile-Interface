import "./styles/App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";

function App() {


  return (
    <>
      <Routes>
        {/* <Route path="/connect" element={null} /> */}
        <Route path="*" element={<>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Dock />
        </>} />
      </Routes>
    </>
  )
}

export default App;