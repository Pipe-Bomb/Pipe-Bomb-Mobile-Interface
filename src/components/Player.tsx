import { useEffect, useState } from "react";
import AudioPlayer, { AudioPlayerStatus } from "../logic/AudioPlayer";
import styles from "../styles/Player.module.scss";
import { TrackMeta } from "pipebomb.js/dist/music/Track";
import Image from "./Image";
import { Text } from "@nextui-org/react";
import { convertArrayToString } from "../logic/Utils";
import IconButton from "./IconButton";
import { MdPause, MdPlayArrow } from "react-icons/md";

export default function Player() {
    const audioPlayer = AudioPlayer.getInstance();
    const [status, setStatus] = useState<AudioPlayerStatus>(audioPlayer.getStatus());
    const [trackMeta, setTrackMeta] = useState<TrackMeta | null>(null);

    useEffect(() => {
        audioPlayer.registerCallback(setStatus);

        return () => {
            audioPlayer.unregisterCallback(setStatus);
        }
    }, []);

    useEffect(() => {
        if (!status.track) return;

        status.track.getMetadata().then(setTrackMeta);
    }, [status.track]);

    function togglePlay() {
        if (!status) return;
        if (status.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    if (!status.track) {
        return null;
    }

    const progress = status.time / status.duration;
    const css = `calc((100% - 14px) * ${progress})`;

    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <Image src={trackMeta?.image} />
            </div>
            <div className={styles.info}>
                <Text h3 className={styles.title}>{trackMeta?.title}</Text>
                <Text h4 className={styles.artist}>{ convertArrayToString(trackMeta?.artists || []) }</Text>
            </div>
            <IconButton onPress={togglePlay}>
                {status.paused ? (
                    <MdPlayArrow />
                ) : (
                    <MdPause />
                )}
                
            </IconButton>
            <div className={styles.progress} style={{width: css}}></div>
        </div>
    )
}