import Collection from "pipebomb.js/dist/collection/Collection";
import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react";
import Image from "./Image";
import styles from "../styles/ListTrack.module.scss";
import { convertArrayToString } from "../logic/Utils";
import AudioPlayer from "../logic/AudioPlayer";

interface ListTrackProps {
    track: Track,
    parentPlaylist?: Collection
  }

export default function ListTrack({ track }: ListTrackProps) {
    const [metadata, setMetadata] = useState<TrackMeta | null>(null);

    useEffect(() => {
        track.getMetadata()
        .then(data => {
            setMetadata(data);
        }).catch(error => {
            console.error(error);
        });
    }, [track]);

    function playTrack() {
        AudioPlayer.getInstance().playTrack(track);
    }

    return (
        <div className={styles.container} key={track.trackID}>
            <div className={styles.image} onClick={playTrack}>
                <Image src={metadata?.image} />
            </div>
            <div className={styles.info}>
                <span className={styles.trackName} onClick={playTrack}>{metadata?.title || track.trackID}</span>
                {metadata && (
                    <span className={styles.artists}>{convertArrayToString(metadata.artists)}</span>
                )}
            </div>
        </div>
    );
}