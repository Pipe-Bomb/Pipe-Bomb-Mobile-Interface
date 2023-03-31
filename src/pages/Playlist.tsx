import { Button, Grid, Text } from "@nextui-org/react";
import Collection from "pipebomb.js/dist/collection/Collection";
import Track from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { MdPlayArrow, MdShuffle } from "react-icons/md";
import { useParams } from "react-router-dom";
import IconButton from "../components/IconButton";
import ListTrack from "../components/ListTrack";
import Loader from "../components/Loader";
import Account, { UserDataFormat } from "../logic/Account";
import PipeBombConnection from "../logic/PipeBombConnection";
import PlaylistIndex from "../logic/PlaylistIndex";
import styles from "../styles/Playlist.module.scss";
import PlaylistImage from "../components/PlaylistImage";
import AudioPlayer from "../logic/AudioPlayer";
import { shuffle } from "../logic/Utils";

let lastPlaylistID = "";

export default function Playlist() {
    let paramID: any = useParams().playlistID;
    const audioPlayer = AudioPlayer.getInstance();

    const [playlist, setPlaylist] = useState<Collection | null>(null);
    const [trackList, setTrackList] = useState<Track[] | null | false>(false);
    const [errorCode, setErrorCode] = useState(0);
    const [selfInfo, setSelfInfo] = useState<UserDataFormat | null>(null);
    const [suggestions, setSuggestions] = useState<Track[] | null>(null);

    const playlistID: string = paramID;

    const callback = (collection: Collection) => {
        if (!collection) return;
        collection.getTrackList(PipeBombConnection.getInstance().getApi().trackCache)
        .then(tracks => {
            if (lastPlaylistID != paramID) return;
            setTrackList(tracks);

            collection.getSuggestedTracks(PipeBombConnection.getInstance().getApi().trackCache)
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
        if (!selfInfo) {
            Account.getInstance().getUserData().then(setSelfInfo);
        }

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
            <Loader text="Loading..."></Loader>
        </div>
    }

    const isOwnPlaylist = selfInfo && selfInfo.userID == playlist.owner.userID;

    if (trackList === false) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.top}>
                    <div className={styles.image}>
                        <PlaylistImage playlist={playlist} />
                    </div>
                    <div className={styles.content}>
                        <Text h1 className={styles.title}>{playlist.getName()}</Text>
                        {!isOwnPlaylist && (
                            <Text h4>by {playlist.owner.username}</Text>
                        )}
                    </div>
                </div>
                <Loader text="Loading Tracks..."></Loader>
            </div>
        )
    }


    const newTrackList: Track[] = trackList || [];

    function playPlaylist() {
        if (!trackList) return;
        audioPlayer.addToQueue(trackList, 0);
        audioPlayer.nextTrack();
    }

    function shufflePlaylist() {
        if (!trackList) return;
        audioPlayer.addToQueue(shuffle(trackList), 0);
        audioPlayer.nextTrack();
    }

    return (
        <>
            <div className={styles.top}>
                <div className={styles.image}>
                    <PlaylistImage playlist={playlist} />
                </div>
                <div className={styles.content}>
                    <Text h1 className={styles.title}>{playlist.getName()}</Text>
                    {!isOwnPlaylist && (
                        <Text h4>by {playlist.owner.username}</Text>
                    )}
                </div>
            </div>
            <Grid.Container gap={2} alignItems="center">
                <Grid>
                    <Button size="xl" auto onPress={playPlaylist} color="gradient">
                        <IconContext.Provider value={{size: "40px"}}>
                            <MdPlayArrow />
                        </IconContext.Provider>
                    </Button>
                </Grid>
                <Grid>
                    <Button size="lg" auto onPress={shufflePlaylist} bordered>
                        <IconContext.Provider value={{size: "30px"}}>
                            <MdShuffle />
                        </IconContext.Provider>
                    </Button>
                </Grid>
            </Grid.Container>
            {newTrackList.map((track, index) => (
                <ListTrack key={index} track={track} parentPlaylist={playlist} />
            ))}
            {/* <div className={styles.suggestions}>
                { generateSuggestions() }
            </div> */}
        </>
    )
}