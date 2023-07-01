import ExternalCollection from "pipebomb.js/dist/collection/ExternalCollection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import PipeBombConnection from "../logic/PipeBombConnection";
import Loader from "../components/Loader";
import { Text } from "@nextui-org/react";
import styles from "../styles/ExternalPlaylistPage.module.scss"
import Image from "../components/Image";
import ListTrack from "../components/ListTrack";
import Track from "pipebomb.js/dist/music/Track";
import AudioPlayer from "../logic/AudioPlayer";
import PlaylistTop from "../components/PlaylistTop";
import { ViewportList } from "react-viewport-list";

export default function ExternalPlaylistPage() {
    const collectionID = useParams().collectionID;
    const [collection, setCollection] = useState<ExternalCollection | false | null>(null);
    const [tracklist, setTracklist] = useState<Track[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!collectionID) return;
        setCollection(null);
        setLoading(true);
        PipeBombConnection.getInstance().getApi().v1.getExternalPlaylist(collectionID)
        .then(setCollection)
        .catch(() => setCollection(false));
    }, [collectionID]);

    function load() {
        if (!collection) return;     
        
        collection.loadNextPage().then(success => {
            setTracklist(collection.getTrackList());
            setLoading(success);
            if (success) {
                load();
            }
        });
    }

    useEffect(load, [collection]);

    useEffect(load, []);

    if (collection === false) {
        return (
            <>
                <Text h1>Error 404</Text>
                <Text h2>Playlist Not Found.</Text>
            </>
        )
    }

    if (!collection) {
        return (
            <Loader text="Loading Playlist" />
        )
    }

    function playPlaylist() {
        if (!tracklist) return;
        AudioPlayer.getInstance().clearQueue();
        AudioPlayer.getInstance().addToQueue(tracklist);
        AudioPlayer.getInstance().nextTrack();
    }

    function shufflePlaylist() {
        if (!tracklist) return;
        AudioPlayer.getInstance().clearQueue();
        AudioPlayer.getInstance().addToQueue(tracklist, true);
        AudioPlayer.getInstance().nextTrack();
    }

     return (
        <>
            <PlaylistTop name={collection.getName()} trackCount={collection.getTrackListLength()} onPlay={playPlaylist} onShuffle={shufflePlaylist} image={collection.getThumbnailUrl()} contextMenu={{
                title: collection.getName(),
                subtitle: collection.service + " playlist",
                image: collection.getThumbnailUrl(),
                options: []
            }} />
            {tracklist && (
                <ViewportList items={tracklist}>
                    {(track, index) => (
                        <ListTrack key={index} track={track} />
                    )}
                </ViewportList>
            )}
            { loading && (
                <div className={styles.loader}>
                    <Loader text="Loading tracks" />
                </div>
            )}
        </>
    )
}