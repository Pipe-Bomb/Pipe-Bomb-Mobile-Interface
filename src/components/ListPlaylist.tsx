import Collection from "pipebomb.js/dist/collection/Collection";
import PlaylistImage from "./PlaylistImage";
import styles from "../styles/ListPlaylist.module.scss";
import { Link } from "react-router-dom";

export interface ListPlaylistProps {
    playlist: Collection
}

export default function ListPlaylist({ playlist }: ListPlaylistProps) {
    return (
        <Link to={`/playlist/${playlist.collectionID}`}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <PlaylistImage playlist={playlist} />
                </div>
                <div className={styles.info}>
                    <span className={styles.title}>{ playlist.getName() }</span>
                    <span className={styles.subtitle}>Playlist</span>
                </div>
            </div>
        </Link>
    )
}