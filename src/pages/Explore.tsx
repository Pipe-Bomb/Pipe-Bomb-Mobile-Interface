import { Button, Grid, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "../styles/Explore.module.scss";
import { Link, useNavigate } from "react-router-dom";
import ChartPreview from "../components/ChartPreview";
import Track from "pipebomb.js/dist/music/Track";
import PipeBombConnection from "../logic/PipeBombConnection";
import SideScrollWrapper from "../components/SideScrollWrapper";

let value = "";

export default function Explore() {
    const navigator = useNavigate();
    const [recommendedTracks, setRecommendedTracks] = useState<Track[] | null | false>(false);
    
    function search() {
        navigator("/search");
    }

    useEffect(() => {
        if (recommendedTracks !== false || !PipeBombConnection.getInstance().getUrl()) return;
        setRecommendedTracks(null);
        const pb = PipeBombConnection.getInstance().getApi();
        pb.trackCache.getTrack("sc-1162937488")
        .then(track => {
            track.getSuggestedTracks(pb.collectionCache, pb.trackCache).then(tracks => {
                setRecommendedTracks(tracks.getTrackList());
            });
        });
    }, []);

    return (
        <>
            <div className={styles.search}>
                <Input
                    size="xl"
                    placeholder="Search"
                    clearable
                    bordered
                    fullWidth
                    className={styles.bar}
                    initialValue={value}
                    onFocus={search}
                />
            </div>
            <ChartPreview chartID="beatport-top-100" />
            <SideScrollWrapper tracks={recommendedTracks} title="Recommended Tracks" />
            <ChartPreview chartID="soundcloud-top-50" />
        </>
    )
}