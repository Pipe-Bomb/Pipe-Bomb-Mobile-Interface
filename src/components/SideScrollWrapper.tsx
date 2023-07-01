import Track from "pipebomb.js/dist/music/Track";
import { Link } from "react-router-dom";
import SideScroll from "./SideScroll";
import Thumbnail from "./Thumbnail";
import TrackThumbnail from "./TrackThumbnail";
import AudioPlayer from "../logic/AudioPlayer";
import Playlist from "pipebomb.js/dist/collection/Playlist";
import ExternalCollection from "pipebomb.js/dist/collection/ExternalCollection";

export interface SideScrollWrapperProps {
    playlists?: Playlist[] | null | undefined | false;
    tracks?: Track[] | null | undefined | false;
    externalCollections?: ExternalCollection[] | null | undefined | false;
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
                    return <Link key={index} to={`/playlist/${playlist.collectionID}`}>
                        <Thumbnail image={playlist.getThumbnailUrl()} title={playlist.getName()} subtitle="Playlist" />
                    </Link>
                })}
            </SideScroll>
        )
    }

    if (props.externalCollections !== undefined) {
        if (!props.externalCollections) {
            return <SideScroll title={props.title} />
        }
        return (
            <SideScroll title={props.title}>
                {props.externalCollections.map((playlist, index) => (
                    <Link key={index} to={`/collection/playlist/${playlist.collectionID}`}>
                        <Thumbnail key={index} title={playlist.getName()} subtitle={playlist.service + " playlist"} image={playlist.getThumbnailUrl()} />
                    </Link>
                ))}
            </SideScroll>
        )
    }

    if (props.tracks !== undefined) {
        if (!props.tracks) {
            return <SideScroll title={props.title} />
        }
        return <SideScroll title={props.title}>
            {props.tracks.map((track, index) => {
                return <TrackThumbnail key={index} track={track} small onClick={() => AudioPlayer.getInstance().playTrack(track)} />
            })}
        </SideScroll>
    }

    return null;
}