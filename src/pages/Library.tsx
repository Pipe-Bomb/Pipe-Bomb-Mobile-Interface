import { useEffect, useState } from "react"
import PlaylistIndex from "../logic/PlaylistIndex"
import Loader from "../components/Loader";
import ListPlaylist from "../components/ListPlaylist";
import { Text } from "@nextui-org/react";
import styles from "../styles/Library.module.scss";

export default function Library() {
    const playlistIndex = PlaylistIndex.getInstance();

    const [playlists, setPlaylists] = useState(playlistIndex.getPlaylists());

    useEffect(() => {
        playlistIndex.registerUpdateCallback(setPlaylists);

        return () => {
            playlistIndex.unregisterUpdateCallback(setPlaylists);
        }
    }, []);

    function generatePlaylistHTML() {
        if (!playlists) {
            return (
                <Loader text="Loading Library..." />
            )
        }

        return playlists.map((playlist, index) => (
            <ListPlaylist playlist={playlist} key={index} />
        ));
    }

    return (
        <>
            <Text h1 className={styles.title}>Library</Text>
            { generatePlaylistHTML() }
        </>
    )
}