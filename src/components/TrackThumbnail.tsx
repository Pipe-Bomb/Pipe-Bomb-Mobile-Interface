import Track, { TrackMeta } from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react";
import Thumbnail from "./Thumbnail";
import { convertArrayToString } from "../logic/Utils";

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

    if (!trackMeta) {
        return (
            <Thumbnail small={small} image="https://i1.sndcdn.com/artworks-000614969926-uqpcnd-large.jpg" title={"unset"} subtitle="Track" onClick={onClick} />
        )
    }
    return (
        <Thumbnail small={small} image={trackMeta.image || ""} title={trackMeta.title} subtitle={convertArrayToString(trackMeta.artists)} onClick={onClick} />
    )
}