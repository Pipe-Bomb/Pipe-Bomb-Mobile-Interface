import { useEffect, useRef, useState } from "react"
import PlaylistIndex from "../logic/PlaylistIndex"
import Loader from "../components/Loader";
import ListPlaylist from "../components/ListPlaylist";
import { Input, Text } from "@nextui-org/react";
import styles from "../styles/Library.module.scss";

let searchValue = "";

export default function Library() {
    const playlistIndex = PlaylistIndex.getInstance();
    const input = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState(searchValue);
    searchValue = search;

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

        const elements: JSX.Element[] = [];

        const lowerSearch = search.toLowerCase();
        playlists.forEach(playlist => {
            if (!search || playlist.getName().toLowerCase().includes(lowerSearch)) {
                elements.push(
                    <ListPlaylist playlist={playlist} key={elements.length} />
                );
            }
        });

        return elements;
    }

    return (
        <>
            <Text h1 className={styles.title}>Library</Text>
            <div className={styles.search}>
                <Input
                    ref={input}
                    size="xl"
                    placeholder="Search playlists"
                    clearable
                    bordered
                    fullWidth
                    onChange={e => setSearch(e.target.value)}
                    className={styles.bar}
                    initialValue={search}
                />
            </div>
            { generatePlaylistHTML() }
        </>
    )
}