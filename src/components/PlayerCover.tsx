import { useEffect, useState } from "react";
import styles from "../styles/PlayerCover.module.scss";
import IconButton from "./IconButton";
import { RxCaretDown } from "react-icons/rx";
import AudioPlayer, { AudioPlayerStatus } from "../logic/AudioPlayer";
import { TrackMeta } from "pipebomb.js/dist/music/Track";
import { Text } from "@nextui-org/react";
import { convertArrayToString } from "../logic/Utils";

let toggleFunction: (value: boolean) => void;

export function setPlayerOpen(open: boolean) {
    toggleFunction(open);
}

export default function PlayerCover() {
    const audioPlayer = AudioPlayer.getInstance();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<AudioPlayerStatus>(audioPlayer.getStatus());
    const [trackMeta, setTrackMeta] = useState<TrackMeta | null>(null);

    toggleFunction = setIsOpen;

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

    if (isOpen && (!status || !status.track)) {
        setIsOpen(false);
    }

    const backgroundImage = (() => {
        if (!trackMeta) {
            return; // load
        }
        if (!trackMeta.image) {
            return; // no image
        }
        return `url(${trackMeta.image})`;
    })();

    const percentage = Math.round(status.time / status.duration * 200) / 2;

    function togglePlay() {
        if (!status) return;
        if (status.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    return (
        <div className={styles.container + (isOpen ? "" : ` ${styles.closed}`) + (status.paused ? "" : ` ${styles.playing}`)} onClick={togglePlay}>
            <div className={styles.background} style={{
                backgroundImage,
                left: `${percentage}%`,
                transform: `translate(${-percentage}%, -50%)`
            }}></div>
            <div className={styles.closeButton}>
                <IconButton onPress={() => setIsOpen(false)} background small>
                    <RxCaretDown />
                </IconButton>
            </div>
            <div className={styles.topInfo}>
                <span>
                    <Text h2 className={styles.title}>
                        {trackMeta?.title}
                    </Text>
                </span>
                <span>
                    <Text h3 className={styles.artist}>
                        { convertArrayToString(trackMeta?.artists || []) }
                    </Text>
                </span>
            </div>
        </div>
    )
}