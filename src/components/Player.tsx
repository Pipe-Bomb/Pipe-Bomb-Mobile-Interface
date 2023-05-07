import AudioPlayer from "../logic/AudioPlayer";
import styles from "../styles/Player.module.scss";
import Image from "./Image";
import { Text } from "@nextui-org/react";
import { convertArrayToString } from "../logic/Utils";
import IconButton from "./IconButton";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { setPlayerOpen } from "./PlayerCover";
import useTrackMeta from "../hooks/TrackMetaHook";
import usePlayerUpdate from "../hooks/PlayerUpdateHook";
import useCurrentTrack from "../hooks/CurrentTrackHook";

export default function Player() {
    const audioPlayer = AudioPlayer.getInstance();
    const track = useCurrentTrack();
    const trackMeta = useTrackMeta(track || false);
    const status = usePlayerUpdate({
        currentTime: true,
        duration: true,
        paused: true,
        buffering: true
    });

    function togglePlay() {
        if (!status) return;
        if (status.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    if (!track) {
        return null;
    }

    const progress = status.currentTime / status.duration;
    const css = `calc((100% - 14px) * ${progress})`;

    return (
        <>
            <div className={styles.container} onClick={() => setPlayerOpen(true)}>
                <div className={styles.image}>
                    <Image loadingSize="md" src={track.getThumbnailUrl()} />
                </div>
                <div className={styles.info}>
                    <Text h3 className={styles.title}>{trackMeta ? trackMeta.title : track.trackID}</Text>
                    <Text h4 className={styles.artist}>{ convertArrayToString(trackMeta ? trackMeta.artists : []) }</Text>
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
            <div className={styles.spacer}></div>
        </>
    )
}