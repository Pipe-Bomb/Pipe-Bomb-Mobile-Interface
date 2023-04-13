import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useRef, useState } from "react";
import Image from "./Image";
import styles from "../styles/ListTrack.module.scss";
import { convertArrayToString } from "../logic/Utils";
import AudioPlayer from "../logic/AudioPlayer";
import Playlist from "pipebomb.js/dist/collection/Playlist";
import { openContextMenu } from "./ContextMenu";
import LazyImage from "./LazyImage";
import { MdOutlinePlaylistAdd } from "react-icons/md";

interface ListTrackProps {
    track: Track,
    parentPlaylist?: Playlist
  }

export default function ListTrack({ track }: ListTrackProps) {
    const [metadata, setMetadata] = useState<TrackMeta | null>(null);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        track.getMetadata()
        .then(data => {
            setMetadata(data);
        }).catch(error => {
            console.error(error);
        });
    }, [track]);

    useEffect(() => {
        if (container.current) {
            const div = container.current;

            let timer: ReturnType<typeof setTimeout>;

            const touchStart = () => {
                timer = setTimeout(() => {
                    openContextMenu({
                        title: metadata?.title || track.trackID,
                        subtitle: convertArrayToString(metadata?.artists || []),
                        image: metadata?.image ? <LazyImage src={metadata?.image} /> : null,
                        options: [
                            {
                                icon: <MdOutlinePlaylistAdd />,
                                name: "Cool New Entry",
                                onPress: () => false
                            },
                            {
                                icon: <MdOutlinePlaylistAdd />,
                                name: "Cool New Entry",
                                onPress: () => false
                            },
                            {
                                icon: <MdOutlinePlaylistAdd />,
                                name: "Cool New Entry",
                                onPress: () => false
                            },
                            {
                                icon: <MdOutlinePlaylistAdd />,
                                name: "Cool New Entry",
                                onPress: () => false
                            }
                        ]
                    });
                }, 300);
            }

            const touchEnd = () => {
                if (timer) clearTimeout(timer);
            }

            div.addEventListener("touchstart", touchStart);
            div.addEventListener("touchend", touchEnd);
            div.addEventListener("touchmove", touchEnd);
            div.addEventListener("touchcancel", touchEnd);

            return () => {
                div.removeEventListener("touchstart", touchStart);
                div.removeEventListener("touchend", touchEnd);
                div.removeEventListener("touchmove", touchEnd);
                div.removeEventListener("touchcancel", touchEnd);
                touchEnd();
            }
        }
    });

    function playTrack() {
        AudioPlayer.getInstance().playTrack(track);
    }

    return (
        <div className={styles.container} ref={container} key={track.trackID} onClick={playTrack}>
            <div className={styles.image} onClick={playTrack}>
                <Image src={metadata?.image} />
            </div>
            <div className={styles.info}>
                <span className={styles.trackName}>{metadata?.title || track.trackID}</span>
                {metadata && (
                    <span className={styles.artists}>{convertArrayToString(metadata.artists)}</span>
                )}
            </div>
        </div>
    );
}