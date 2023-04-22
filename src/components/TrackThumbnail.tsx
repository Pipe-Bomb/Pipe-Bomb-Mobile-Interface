import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useRef, useState } from "react";
import Thumbnail from "./Thumbnail";
import { convertArrayToString } from "../logic/Utils";
import { ContextMenuEntry, openContextMenu } from "./ContextMenu";
import { MdOutlineFileDownload, MdOutlinePlaylistAdd, MdPlaylistPlay, MdQueueMusic } from "react-icons/md";
import AudioPlayer from "../logic/AudioPlayer";
import LazyImage from "./LazyImage";
import { openAddToPlaylist } from "./AddToPlaylist";

export interface TrackThumbnailProps {
    track: Track
    small?: boolean
    onClick?: () => void
}

export default function TrackThumbnail({ track, small, onClick }: TrackThumbnailProps) {
    const [trackMeta, setTrackMeta] = useState<TrackMeta | null>(null);

    useEffect(() => {
        track.getMetadata().then(setTrackMeta);
    }, [track]);
    
    function hold() {
        const options: ContextMenuEntry[] = [
            {
                icon: <MdPlaylistPlay />,
                name: "Play next",
                onPress: () => {
                    AudioPlayer.getInstance().addToQueue([track], 0);
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
            title: trackMeta?.title || track.trackID,
            subtitle: convertArrayToString(trackMeta?.artists || []),
            image: trackMeta?.image ? <LazyImage src={trackMeta?.image} /> : null,
            options
        });
    }

    if (!trackMeta) {
        return null;
    }
    return (
        <Thumbnail small={small} image={trackMeta.image || ""} title={trackMeta.title} subtitle={convertArrayToString(trackMeta.artists)} onClick={onClick} onHold={hold} />
    )
}