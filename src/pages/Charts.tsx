import TrackList from "pipebomb.js/dist/collection/TrackList";
import { useEffect, useState } from "react";
import ChartIndex from "../logic/ChartIndex";
import PipeBombConnection from "../logic/PipeBombConnection";
import Loader from "../components/Loader";
import styles from "../styles/Charts.module.scss";
import { Text } from "@nextui-org/react";
import SquareChart from "../components/SquareChart";

export default function Charts() {
    const [charts, setCharts] = useState<TrackList[] | null>(null);

    function reload() {
        ChartIndex.getInstance().getCharts().then(setCharts);
    }

    useEffect(() => {

        PipeBombConnection.getInstance().registerUpdateCallback(reload);
        reload();

        return () => {
            PipeBombConnection.getInstance().unregisterUpdateCallback(reload);
        }
    }, []);

    if (charts === null) {
        return (
            <div className={styles.loaderContainer}>
                <Loader text="Loading Charts" />
            </div>
        )
    }

    if (!charts.length) {
        return (
            <>
                <Text h2 className={styles.title}>Charts</Text>
                <Text h4>Couldn't find any charts!</Text>
            </>
        )
    }

    return (
        <>
            <Text h2 className={styles.title}>Charts</Text>
            <div className={styles.chartsContainer}>
                {charts.map((chart, index) => (
                    <div key={index} className={styles.playlist}>
                        <SquareChart chart={chart} />
                    </div>
                ))}
            </div>
        </>
    )
}