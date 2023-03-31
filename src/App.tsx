import "./styles/App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";
import Connect from "./pages/Connect";
import Head from "./components/Head";
import Playlist from "./pages/Playlist";
import Player from "./components/Player";

function App() {
  return (
    <>
      <Routes>
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={<>
          <Head />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlist/:playlistID" element={<Playlist />} />
          </Routes>
          <Player />
          <Dock />
        </>} />
      </Routes>
    </>
  )
}

export default App;