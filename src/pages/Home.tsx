import Collection from "pipebomb.js/dist/collection/Collection"
import Track from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import MiniTile from "../components/MiniTile";
import PlaylistImage from "../components/PlaylistImage";
import SideScroll from "../components/SideScroll";
import SideScrollWrapper from "../components/SideScrollWrapper";
import Thumbnail from "../components/Thumbnail";
import Account, { UserDataFormat } from "../logic/Account";
import PipeBombConnection from "../logic/PipeBombConnection";
import PlaylistIndex from "../logic/PlaylistIndex";
import styles from "../styles/Home.module.scss";

export default function Home() {
    const [userData, setUserData] = useState<UserDataFormat | null>(null);
    const [playlists, setPlaylists] = useState<Collection[] | null>(PlaylistIndex.getInstance().getPlaylists());
    const [recommendedTracks, setRecommendedTracks] = useState<Track[] | null | false>(false);

    useEffect(() => {
        PlaylistIndex.getInstance().registerUpdateCallback(setPlaylists);

        return () => {
            PlaylistIndex.getInstance().unregisterUpdateCallback(setPlaylists);
        }
    });

    useEffect(() => {
        Account.getInstance().getUserData().then(setUserData);

        if (recommendedTracks !== false || !PipeBombConnection.getInstance().getUrl()) return;
        setRecommendedTracks(null);
        const pb = PipeBombConnection.getInstance().getApi();
        pb.trackCache.getTrack("sc-698172412")
        .then(track => {
            track.getSuggestedTracks(pb.collectionCache, pb.trackCache).then(tracks => {
                setRecommendedTracks(tracks.getTrackList());
            });
        });
    }, []);

    function generateMiniTilePlaylists() {
        if (!playlists) return <h2>Loading</h2>;
        
        const list = Array.from(playlists).splice(-6);
        
        return list.map((playlist, index) => {
            return <Link key={index} to={`/playlist/${playlist.collectionID}`}>
                <MiniTile title={playlist.getName()} image={<PlaylistImage playlist={playlist} />} />
            </Link>
        });
    }

    return (
        <>
            <h1 className={styles.title}>{userData ? (
                "Welcome, " + userData.username + "!"
            ) : (
                "Welcome!"
            )}</h1>
            <div className={styles.miniTileContainer}>
                { generateMiniTilePlaylists() }
            </div>
            <SideScrollWrapper playlists={playlists} title="Your Playlists" />
            <SideScrollWrapper tracks={recommendedTracks} title="Recommended Tracks" />
        </>
    )
}