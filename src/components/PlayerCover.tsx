import { useEffect, useRef, useState } from "react";
import styles from "../styles/PlayerCover.module.scss";
import AudioPlayer, { AudioPlayerStatus } from "../logic/AudioPlayer";
import { lerp } from "../logic/Utils";
import PlayerCoverSlide from "./PlayerCoverSlide";

let toggleFunction: (value: boolean) => void;

export function setPlayerOpen(open: boolean) {
    toggleFunction(open);
}

export default function PlayerCover() {
    const audioPlayer = AudioPlayer.getInstance();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<AudioPlayerStatus>(audioPlayer.getStatus());
    
    
    const container = useRef<any>(null);

    toggleFunction = setIsOpen;

    useEffect(() => {
        audioPlayer.registerCallback(setStatus);

        return () => {
            audioPlayer.unregisterCallback(setStatus);
        }
    }, []);

    if (isOpen && (!status || !status.track)) {
        setIsOpen(false);
    }

    function togglePlay() {
        if (!status) return;
        if (status.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    function regularMouseDown(e: React.TouchEvent) {
        const startX = e.touches[0].clientX;
        const startY = e.touches[0].clientY;

        let active = true;
        let direction: "vertical" | "horizontal" | null = null;

        let xOffset = 0;

        function move(e: TouchEvent) {
            if (!active) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            if (!direction) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    direction = "horizontal";
                } else {
                    direction = "vertical";
                }
            }

            const containerElement: HTMLElement = container.current;

            if (direction == "horizontal") {
                xOffset = deltaX;
                containerElement.style.left = `calc(-100% + ${deltaX}px)`;
            } else {

            }
        }

        function mouseUp() {
            active = false;
            document.removeEventListener("touchend", mouseUp);
            document.removeEventListener("touchmove", move);

            const containerElement: HTMLElement = container.current;
            if (Math.abs(xOffset) > containerElement.clientWidth / 12) {
                if (xOffset < 0) {
                    lerp(xOffset, -containerElement.clientWidth / 3, 50, value => {
                        containerElement.style.left = `calc(-100% + ${value}px)`;
                    });
                    setTimeout(() => {
                        AudioPlayer.getInstance().nextTrack();
                        setTimeout(() => {
                            containerElement.style.left = "-100%";
                        }, 0);
                    }, 50);
                } else {
                    lerp(xOffset, containerElement.clientWidth / 3, 50, value => {
                        containerElement.style.left = `calc(-100% + ${value}px)`;
                    });
                    setTimeout(() => {
                        AudioPlayer.getInstance().previousTrack();
                        setTimeout(() => {
                            containerElement.style.left = "-100%";
                        }, 0);
                    }, 50);
                }
            } else {
                lerp(xOffset, 0, 50, value => {
                    containerElement.style.left = `calc(-100% + ${value}px)`;
                });
            }
        }

        document.addEventListener("touchmove", move);
        document.addEventListener("touchend", mouseUp);
    }

    return (
        <div ref={container} className={styles.container + (isOpen ? "" : ` ${styles.closed}`)} onClick={togglePlay} onTouchStart={regularMouseDown}>
            {status.track && (
                <PlayerCoverSlide track={status.track} />
            )}
            {status.track && (
                <PlayerCoverSlide track={status.track} status={status} />
            )}
            {status.track && (
                <PlayerCoverSlide track={status.queue[0] || status.track} />
            )}
        </div>
    )
}