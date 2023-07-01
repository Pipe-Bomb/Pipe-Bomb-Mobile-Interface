import Track from "pipebomb.js/dist/music/Track";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import MiniTile from "../components/MiniTile";
import SideScrollWrapper from "../components/SideScrollWrapper";
import PipeBombConnection, { UserData } from "../logic/PipeBombConnection";
import PlaylistIndex from "../logic/PlaylistIndex";
import styles from "../styles/Home.module.scss";
import Playlist from "pipebomb.js/dist/collection/Playlist";
import ChartPreview from "../components/ChartPreview";

export default function Home() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[] | null>(PlaylistIndex.getInstance().getPlaylists());
    const [recommendedTracks, setRecommendedTracks] = useState<Track[] | null | false>(false);

    useEffect(() => {
        PlaylistIndex.getInstance().registerUpdateCallback(setPlaylists);

        return () => {
            PlaylistIndex.getInstance().unregisterUpdateCallback(setPlaylists);
        }
    });

    useEffect(() => {
        PipeBombConnection.getInstance().getUserData().then(setUserData);

        if (recommendedTracks !== false || !PipeBombConnection.getInstance().getUrl()) return;
        setRecommendedTracks(null);
        const pb = PipeBombConnection.getInstance().getApi();
        pb.trackCache.getTrack("sc-1162937488")
        .then(track => {
            track.getSuggestedTracks().then(tracks => {
                setRecommendedTracks(tracks.getTrackList());
            });
        });
    }, []);

    function generateMiniTilePlaylists() {
        if (!playlists) return <h2>Loading</h2>;
        
        const list = Array.from(playlists).splice(-6);
        
        return list.map((playlist, index) => {
            return <Link key={index} to={`/playlist/${playlist.collectionID}`}>
                <MiniTile title={playlist.getName()} image={playlist.getThumbnailUrl()} />
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
            <ChartPreview chartID="beatport-top-100" />
        </>
    )
}