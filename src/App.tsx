import styles from "./styles/App.module.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";
import Connect from "./pages/Connect";
import Head from "./components/Head";
import Playlist from "./pages/Playlist";
import Player from "./components/Player";
import PlayerCover from "./components/PlayerCover";

function App() {
  return (
    <>
      <Routes>
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={
          <div className={styles.flex}>
            <Head />
            <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlist/:playlistID" element={<Playlist />} />
            </Routes>
            <Player />
            <PlayerCover />
            <Dock />
          </div>
          </div>
        } />
      </Routes>
    </>
  )
}

export default App;