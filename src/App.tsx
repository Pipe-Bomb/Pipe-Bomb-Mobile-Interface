import styles from "./styles/App.module.scss";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dock from "./components/Dock";
import Connect from "./pages/Connect";
import Head from "./components/Head";
import Playlist from "./pages/Playlist";
import Player from "./components/Player";
import PlayerCover from "./components/PlayerCover";
import PipeBombConnection from "./logic/PipeBombConnection";
import { useEffect, useRef, useState } from "react";
import Library from "./pages/Library";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Chart from "./pages/Chart";
import Charts from "./pages/Charts";
import ContextMenu from "./components/ContextMenu";
import AddToPlaylist from "./components/AddToPlaylist";
import CreatePlaylist from "./components/CreatePlaylist";
import ExternalPlaylistPage from "./pages/ExternalPlaylistPage";
import useAuthenticationStatus from "./hooks/AuthenticationStatusHook";
import LoginPage from "./pages/LoginPage";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const content = useRef<HTMLDivElement>(null);

    const authStatus = useAuthenticationStatus();
    const [lastUrl, setLastUrl] = useState("");

    useEffect(() => {
        const path = location.pathname;
        if (!path.includes("@") || !path.includes("/")) return;
        const end = path.split("/").pop();
        if (!end.includes("@")) return;
        const parts = end.split("@", 2);
        if (parts[0] != PipeBombConnection.getInstance().getApi().context.getAddress()) return;
        const newPath = path.substring(0, path.length - end.length) + parts[1];
        navigate(newPath);
    }, [location.pathname]);

    useEffect(() => {
        if (authStatus == "disconnected" || authStatus == "loading") {
            navigate("/connect");
        } else if (authStatus == "unauthenticated") {
            setLastUrl(location.pathname);
            navigate("/login");
        } else if (authStatus == "authenticated" && location.pathname == "/login") {
            setLastUrl("");
            if (lastUrl && lastUrl != "/login") {
                navigate(lastUrl);
            } else {
                navigate("/");
            }
        }
    }, [authStatus]);

    return (
        <>
            <Routes>
                <Route path="/connect" element={<Connect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={
                    <div className={styles.flex}>
                        <Head />
                            <div ref={content} className={styles.content}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/playlist/:playlistID" element={<Playlist />} />
                                    <Route path="/charts">
                                        <Route index element={<Charts />} />
                                        <Route path=":chartID" element={<Chart />}></Route>
                                    </Route>
                                    <Route path="/library" element={<Library />} />
                                    <Route path="/explore" element={<Explore />} />
                                    <Route path="/search" element={<Search />} />
                                    <Route path="/collection/playlist/:collectionID" element={<ExternalPlaylistPage />} />
                                </Routes>
                                <Player />
                                <PlayerCover />
                                <Dock />
                                <ContextMenu />
                                <AddToPlaylist />
                                <CreatePlaylist />
                          </div>
                    </div>
                } />
            </Routes>
        </>
    )
}

export default App;