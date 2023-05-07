import Track from "pipebomb.js/dist/music/Track";
import AudioPlayer from "../logic/AudioPlayer";
import styles from "../styles/PlayerCoverSlide.module.scss";
import { useRef, useState } from "react";
import IconButton from "./IconButton";
import { RxCaretDown } from "react-icons/rx";
import { Text } from "@nextui-org/react";
import { convertArrayToString, formatTime } from "../logic/Utils";
import Waveform from "./Waveform";
import PipeBombConnection from "../logic/PipeBombConnection";
import { setPlayerOpen } from "./PlayerCover";
import LazyImage from "./LazyImage";
import { MdPlayArrow, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import useTrackMeta from "../hooks/TrackMetaHook";
import { AudioTypeStatus } from "../logic/audio/AudioType";
import Image from "./Image";

export interface PlaylistCoverSlideProps {
    track: Track,
    status?: AudioTypeStatus
}

export default function PlayerCoverSlide({ track, status }: PlaylistCoverSlideProps) {
    const trackMeta = useTrackMeta(track);
    const waveform = useRef(null);
    const [tempPercentChange, setTempPercentChange] = useState<number | null>(null);

    const percentage = status ? (tempPercentChange === null ? (status.currentTime / status.duration * 100) : tempPercentChange) : 0;

    function waveformMouseDown(e: React.TouchEvent) {
        if (!waveform.current) return;
        const waveformElement: HTMLElement = waveform.current;
        

        const startX = e.touches[0].clientX;
        let newPercentage = percentage;

        setTempPercentChange(percentage);

        let active = true;

        function move(e: TouchEvent) {
            if (!active) return;
            e.stopImmediatePropagation();
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

    return (
        <div className={styles.slide + (status && !status.paused ? ` ${styles.playing}` : "")}>
            <div className={styles.background} style={{
                backgroundImage: `url(${track.getThumbnailUrl()})`,
                left: `${percentage}%`,
                transform: `translate(${-percentage}%, -50%)`
            }}></div>
            <div className={styles.closeButton}>
                <IconButton onPress={() => setPlayerOpen(false)} background small>
                    <RxCaretDown />
                </IconButton>
            </div>
            <div className={styles.topInfo}>
                <span>
                    <Text h2 className={styles.title}>
                        {trackMeta ? trackMeta.title : track?.trackID}
                    </Text>
                </span>
                <span>
                    <Text h3 className={styles.artist}>
                        { convertArrayToString(trackMeta ? trackMeta.artists : []) }
                    </Text>
                </span>
            </div>
            <div className={styles.thumbnailContainer + (status?.paused !== false ? ` ${styles.thumbnailEnabled}` : "")}>
                <div className={styles.thumbnail}>
                    <Image src={track.getThumbnailUrl()} />
                </div>
                {status?.paused !== false ? (
                    <div className={styles.buttons}>
                        <IconButton onPress={() => AudioPlayer.getInstance().previousTrack()} small>
                            <MdSkipPrevious />
                        </IconButton>
                        <IconButton onPress={() => AudioPlayer.getInstance().play()}>
                            <MdPlayArrow />
                        </IconButton>
                        <IconButton onPress={() => AudioPlayer.getInstance().nextTrack()} small>
                            <MdSkipNext />
                        </IconButton>
                    </div>
                ) : null}
            </div>
            <div className={styles.waveformMouseHandler} onTouchStart={waveformMouseDown}>
                <div ref={status ? waveform : null} className={styles.waveformContainer} style={{transform: `translateX(${-percentage}%)`}}>
                    <Waveform url={track?.getAudioUrl()} active={status ? !status.paused : false} percent={percentage} />
                </div>
            </div>
            <span className={styles.time}>{ formatTime(status ? Math.max(0, status.duration * percentage / 100) : 0) }</span>
            <span className={styles.duration}>{ formatTime(status ? Math.max(status.duration, 0) : 0) }</span>
        </div>
    )
}