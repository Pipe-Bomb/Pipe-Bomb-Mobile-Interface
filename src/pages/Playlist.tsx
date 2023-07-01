import { Text } from "@nextui-org/react";
import Track from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListTrack from "../components/ListTrack";
import Loader from "../components/Loader";
import PlaylistIndex from "../logic/PlaylistIndex";
import styles from "../styles/Playlist.module.scss";
import AudioPlayer from "../logic/AudioPlayer";
import { shuffle } from "../logic/Utils";
import PipeBombPlaylist from "pipebomb.js/dist/collection/Playlist";
import PlaylistTop from "../components/PlaylistTop";
import { ViewportList } from "react-viewport-list";
import { UserData } from "../logic/PipeBombConnection";
import useIsSelf from "../hooks/IsSelfHook";
import Image from "../components/Image";

let lastPlaylistID = "";

export default function Playlist() {
    let paramID: any = useParams().playlistID;
    const audioPlayer = AudioPlayer.getInstance();

    const [playlist, setPlaylist] = useState<PipeBombPlaylist | null>(null);
    const [trackList, setTrackList] = useState<Track[] | null | false>(false);
    const [errorCode, setErrorCode] = useState(0);
    const [suggestions, setSuggestions] = useState<Track[] | null>(null);
    const self = useIsSelf(playlist?.owner);

    const playlistID: string = paramID;

    const callback = (collection: PipeBombPlaylist) => {
        if (!collection) return;
        collection.getTrackList()
        .then(tracks => {
            if (lastPlaylistID != paramID) return;
            setTrackList(tracks);

            collection.getSuggestedTracks()
            .then(newSuggestions => {
                if (lastPlaylistID != paramID) return;
                setSuggestions(newSuggestions);
            })
        });
    }

    useEffect(() => {
        lastPlaylistID = paramID;
        setTrackList(false);
        setPlaylist(null);
        setSuggestions(null);

        let alive = true;
        PlaylistIndex.getInstance().getPlaylist(playlistID)
        .then(collection => {
            if (!alive) return;
            setPlaylist(collection);
            callback(collection);
        }).catch(error => {
            if (error?.statusCode == 400) {
                setErrorCode(400);
            } else {
                setErrorCode(500);
                console.error(error);
            }
        });

        return () => {
            alive = false;
        }
    }, [paramID]);

    useEffect(() => {
        if (playlist) {
            playlist.registerUpdateCallback(callback);
        }

        return () => {
            if (playlist) {
                playlist.unregisterUpdateCallback(callback);
            }
        }
    }, [playlist]);

    if (errorCode == 400) {
        return (
            <>
                <Text h1>Error 404</Text>
                <Text h3>Playlist Not Found.</Text>
            </>
        )
    }

    if (paramID === undefined || isNaN(parseInt(paramID)) || errorCode != 0) {
        return (
            <>
                <Text h1>Error 500</Text>
                <Text h3>Something went wrong!</Text>
            </>
        )
    }

    if (!playlist) {
        return <div className={styles.loaderContainer}>
            <Loader text="Loading"></Loader>
        </div>
    }

    if (trackList === false) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.top}>
                    <div className={styles.image}>
                        <Image src={playlist.getThumbnailUrl()} />
                    </div>
                    <div className={styles.content}>
                        <Text h1 className={styles.title}>{playlist.getName()}</Text>
                        {!self && (
                            <Text h4>by {playlist.owner.username}</Text>
                        )}
                    </div>
                </div>
                <Loader text="Loading Tracks"></Loader>
            </div>
        )
    }


    const newTrackList: Track[] = trackList || [];

    function playPlaylist() {
        if (!trackList) return;
        audioPlayer.addToQueue(trackList, false, 0);
        audioPlayer.nextTrack();
    }

    function shufflePlaylist() {
        if (!trackList) return;
        audioPlayer.addToQueue(shuffle(trackList), true, 0);
        audioPlayer.nextTrack();
    }

    return (
        <>
            <PlaylistTop name={playlist.getName()} trackCount={trackList ? trackList.length : undefined} onPlay={playPlaylist} onShuffle={shufflePlaylist} owner={playlist.owner} image={playlist.getThumbnailUrl()} contextMenu={{
                title: playlist.getName(),
                subtitle: "Playlist",
                image: playlist.getThumbnailUrl(),
                options: []
            }} />
            <ViewportList items={newTrackList}>
                {(track, index) => (
                    <ListTrack key={index} track={track} parentPlaylist={playlist} />
                )}
            </ViewportList>
            {/* <div className={styles.suggestions}>
                { generateSuggestions() }
            </div> */}
        </>
    )
}