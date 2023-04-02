import { useEffect, useRef, useState } from "react";
import styles from "../styles/PlayerCover.module.scss";
import IconButton from "./IconButton";
import { RxCaretDown } from "react-icons/rx";
import AudioPlayer, { AudioPlayerStatus } from "../logic/AudioPlayer";
import { TrackMeta } from "pipebomb.js/dist/music/Track";
import { Text } from "@nextui-org/react";
import { convertArrayToString } from "../logic/Utils";
import { formatTime } from "../logic/Utils";
import Waveform from "./Waveform";
import PipeBombConnection from "../logic/PipeBombConnection";

let toggleFunction: (value: boolean) => void;

export function setPlayerOpen(open: boolean) {
    toggleFunction(open);
}

export default function PlayerCover() {
    const audioPlayer = AudioPlayer.getInstance();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<AudioPlayerStatus>(audioPlayer.getStatus());
    const [trackMeta, setTrackMeta] = useState<TrackMeta | null>(null);
    const [tempPercentChange, setTempPercentChange] = useState<number | null>(null);
    const waveform = useRef(null);

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

    const percentage = status.time / status.duration * 100;

    function togglePlay() {
        if (!status) return;
        if (status.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    function waveformMouseDown(e: React.TouchEvent) {
        if (!waveform.current) return;
        const waveformElement: HTMLElement = waveform.current;
        

        const startX = e.touches[0].clientX;
        let newPercentage = percentage;

        setTempPercentChange(percentage);

        let active = true;

        function move(e: TouchEvent) {
            if (!active) return;
            const difference = startX - e.touches[0].clientX;
            const percentChange = difference / waveformElement.clientWidth * 100;
            newPercentage = Math.min(Math.max(percentage + percentChange, 0), 100);
            setTempPercentChange(newPercentage);
        }

        function mouseUp() {
            active = false;
            document.removeEventListener("touchend", mouseUp);
            document.removeEventListener("touchmove", move);
            AudioPlayer.getInstance().setTime(newPercentage);
            setTimeout(() => {
                setTempPercentChange(null);
            }, 50);
        }

        document.addEventListener("touchmove", move);
        document.addEventListener("touchend", mouseUp);
    }

    const usingPercentage = tempPercentChange === null ? percentage : tempPercentChange;

    return (
        <div className={styles.container + (isOpen ? "" : ` ${styles.closed}`) + (status.paused ? "" : ` ${styles.playing}`)} onClick={togglePlay}>
            <div className={styles.background} style={{
                backgroundImage,
                left: `${usingPercentage}%`,
                transform: `translate(${-usingPercentage}%, -50%)`
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
            <div className={styles.waveformMouseHandler} onTouchStart={waveformMouseDown}>
                <div ref={waveform} className={styles.waveformContainer} style={{transform: `translateX(${-usingPercentage}%)`}}>
                    <Waveform url={`${PipeBombConnection.getInstance().getUrl()}/v1/audio/${status.track?.trackID}`} active={!status.paused} percent={usingPercentage} />
                </div>
            </div>
            <span className={styles.time}>{ formatTime(Math.max(0, status.duration * usingPercentage / 100)) }</span>
            <span className={styles.duration}>{ formatTime(Math.max(status.duration, 0)) }</span>
        </div>
    )
}