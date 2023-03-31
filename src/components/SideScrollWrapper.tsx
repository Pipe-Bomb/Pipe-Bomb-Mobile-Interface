import Collection from "pipebomb.js/dist/collection/Collection";
import Track from "pipebomb.js/dist/music/Track";
import PlaylistImage from "./PlaylistImage";
import SideScroll from "./SideScroll";
import Thumbnail from "./Thumbnail";
import TrackThumbnail from "./TrackThumbnail";

export interface SideScrollWrapperProps {
    playlists?: Collection[] | null | undefined | false;
    tracks?: Track[] | null | undefined | false;
    title: string
}

export default function SideScrollWrapper(props: SideScrollWrapperProps) {

    if (props.playlists !== undefined) {
        if (!props.playlists) {
            return <SideScroll title={props.title} />
        }
        return (
            <SideScroll title={props.title}>
                {props.playlists.map((playlist, index) => {
                    return <Thumbnail key={index} image={<PlaylistImage playlist={playlist} />} title={playlist.getName()} subtitle="Playlist" />
                })}
            </SideScroll>
        )
    }

    if (props.tracks !== undefined) {
        if (!props.tracks) {
            return <SideScroll title={props.title} />
        }
        return <SideScroll title={props.title}>
            {props.tracks.map((track, index) => {
                return <TrackThumbnail key={index} track={track} small />
            })}
        </SideScroll>
    }

    return null;
}