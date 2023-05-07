import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useRef, useState } from "react";
import Image from "./Image";
import styles from "../styles/ListTrack.module.scss";
import { convertArrayToString } from "../logic/Utils";
import AudioPlayer from "../logic/AudioPlayer";
import Playlist from "pipebomb.js/dist/collection/Playlist";
import { ContextMenuEntry, openContextMenu } from "./ContextMenu";
import LazyImage from "./LazyImage";
import { MdOutlineFileDownload, MdOutlinePlaylistAdd, MdOutlinePlaylistRemove, MdPlaylistPlay, MdQueueMusic } from "react-icons/md";
import { openAddToPlaylist } from "./AddToPlaylist";
import useTrackMeta from "../hooks/TrackMetaHook";

interface ListTrackProps {
    track: Track,
    parentPlaylist?: Playlist
}

export default function ListTrack({ track, parentPlaylist }: ListTrackProps) {
    const metadata = useTrackMeta(track);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current) {
            const div = container.current;

            let timer: ReturnType<typeof setTimeout>;

            const touchStart = () => {
                timer = setTimeout(() => {
                    const options: ContextMenuEntry[] = [
                        {
                            icon: <MdPlaylistPlay />,
                            name: "Play next",
                            onPress: () => {
                                AudioPlayer.getInstance().addToQueue([track], false, 0);
                                return false;
                            }
                        },
                        {
                            icon: <MdQueueMusic />,
                            name: "Add to queue",
                            onPress: () => {
                                AudioPlayer.getInstance().addToQueue([track]);
                                return false;
                            }
                        },
                        {
                            icon: <MdOutlinePlaylistAdd />,
                            name: "Add to playlist",
                            onPress: () => {
                                setTimeout(() => {
                                    openAddToPlaylist(track);
                                }, 100);
                                return false;
                            }
                        },
                        {
                            icon: <MdOutlineFileDownload />,
                            name: "Download",
                            disabled: true,
                            onPress: () => false
                        }
                    ];

                    if (parentPlaylist) {
                        options.push({
                            icon: <MdOutlinePlaylistRemove />,
                            name: "Remove from playlist",
                            onPress: () => {
                                parentPlaylist.removeTracks(track);
                                return false;
                            }
                        });
                    }


                    openContextMenu({
                        title: metadata ? metadata.title : track.trackID,
                        subtitle: convertArrayToString(metadata ? metadata.artists : []),
                        image: <Image border src={track.getThumbnailUrl()} />,
                        options
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
                <Image loadingSize="md" src={track.getThumbnailUrl()} />
            </div>
            <div className={styles.info}>
                <span className={styles.trackName}>{metadata ? metadata.title : track.trackID}</span>
                {metadata && (
                    <span className={styles.artists}>{convertArrayToString(metadata.artists)}</span>
                )}
            </div>
        </div>
    );
}