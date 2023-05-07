import TrackList from "pipebomb.js/dist/collection/TrackList";
import { useEffect, useState } from "react";
import ChartIndex from "../logic/ChartIndex";
import Track from "pipebomb.js/dist/music/Track";
import Loader from "./Loader";
import styles from "../styles/ChartPreview.module.scss";
import { Button, Text } from "@nextui-org/react";
import NumberWrapper from "./NumberWrapper";
import ListTrack from "./ListTrack";
import { Link } from "react-router-dom";
import { MdReadMore } from "react-icons/md";

export interface ChartPreviewProps {
    chartID: string,
}

export default function ChartPreview({ chartID }: ChartPreviewProps) {
    const [chart, setChart] = useState<TrackList | null | false>(null);
    const [trackList, setTrackList] = useState<Track[] | null>(null);

    useEffect(() => {
        ChartIndex.getInstance().getChart(chartID).then(chart => {
            setChart(chart);
            const newTrackList = chart.getTrackList();
            if (newTrackList) {
                setTrackList(newTrackList);
            }
        }).catch(() => {
            setChart(false);
        })
    }, [chartID]);

    if (chart === false) {
        return null;
    }

    if (!chart || !trackList) {
        return (
            <div className={styles.loaderContainer}>
                <Loader text="Loading Chart"></Loader>
            </div>
        )
    }

    const splits: Track[][] = [];

    for (let i = 0; i < trackList.length; i++) {
        if (!(i % 5)) {
            splits[i / 5] = [trackList[i]];
        } else {
            splits[Math.floor(i / 5)].push(trackList[i]);
        }
    }

    return (
        <>
            <div className={styles.top}>
                <Link to={`/charts/${chart.collectionID.split("/").pop()}`}>
                    <Text h2 className={styles.title}>{chart.getName()}</Text>
                </Link>
                <Link to="/charts" className={styles.roundBorder}>
                    <MdReadMore />
                </Link>
            </div>
            <div className={styles.splitContainer}>
                {splits.map((split, splitIndex) => (
                    <div key={splitIndex} className={styles.split}>
                        {split.map((track, index) => (
                            <NumberWrapper key={index} number={splitIndex * 5 + index + 1}>
                                <ListTrack track={track} />
                            </NumberWrapper>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}