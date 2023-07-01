import styles from "../styles/ListPlaylist.module.scss";
import { Link } from "react-router-dom";
import Playlist from "pipebomb.js/dist/collection/Playlist";
import Image from "./Image";

export interface ListPlaylistProps {
    playlist: Playlist
}

export default function ListPlaylist({ playlist }: ListPlaylistProps) {
    return (
        <Link to={`/playlist/${playlist.collectionID}`}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <Image src={playlist.getThumbnailUrl()} loadingSize="md" border />
                </div>
                <div className={styles.info}>
                    <span className={styles.title}>{ playlist.getName() }</span>
                    <span className={styles.subtitle}>Playlist</span>
                </div>
            </div>
        </Link>
    )
}