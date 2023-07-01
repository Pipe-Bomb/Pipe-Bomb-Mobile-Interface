import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useRef, useState } from "react";
import Thumbnail from "./Thumbnail";
import { convertArrayToString } from "../logic/Utils";
import { ContextMenuEntry, openContextMenu } from "./ContextMenu";
import { MdOutlineFileDownload, MdOutlinePlaylistAdd, MdPlaylistPlay, MdQueueMusic } from "react-icons/md";
import AudioPlayer from "../logic/AudioPlayer";
import LazyImage from "./LazyImage";
import { openAddToPlaylist } from "./AddToPlaylist";
import useTrackMeta from "../hooks/TrackMetaHook";

export interface TrackThumbnailProps {
    track: Track
    small?: boolean
    onClick?: () => void
}

export default function TrackThumbnail({ track, small, onClick }: TrackThumbnailProps) {
    const trackMeta = useTrackMeta(track);
    
    function hold() {
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

        openContextMenu({
            title: trackMeta ? trackMeta.title : track.trackID,
            subtitle: convertArrayToString(trackMeta ? trackMeta.artists : []),
            image: track.getThumbnailUrl(),
            options
        });
    }

    if (!trackMeta) {
        return null;
    }
    return (
        <Thumbnail small={small} image={track.getThumbnailUrl()} title={trackMeta.title} subtitle={convertArrayToString(trackMeta.artists)} onClick={onClick} onHold={hold} />
    )
}