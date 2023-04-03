import styles from "./styles/App.module.scss";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";
import Connect, { connectToHost } from "./pages/Connect";
import Head from "./components/Head";
import Playlist from "./pages/Playlist";
import Player from "./components/Player";
import PlayerCover from "./components/PlayerCover";
import PipeBombConnection from "./logic/PipeBombConnection";
import ServerIndex from "./logic/ServerIndex";
import Account from "./logic/Account";
import { useEffect } from "react";
import Library from "./pages/Library";
import Explore from "./pages/Explore";
import Search from "./pages/Search";

let needsConnect = false;

if (!PipeBombConnection.getInstance().getUrl()) {
  const host = localStorage.getItem("host");
  let connected = false;
  if (host) {
      const hostInfo = ServerIndex.getInstance().getServer(host);
      if (hostInfo) {
          connectToHost(hostInfo, "secure");   
          connected = true;
      }
  }
  if (!connected) {
    needsConnect = true;
  }
}
Account.getInstance();

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (needsConnect) {
      needsConnect = false;
      navigate("/connect");
    }
  }, []);

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
                <Route path="/library" element={<Library />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/search" element={<Search />} />
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