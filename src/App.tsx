import "./styles/App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";
import Connect from "./pages/Connect";
import Head from "./components/Head";

function App() {
  return (
    <>
      <Routes>
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={<>
          <Head />
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