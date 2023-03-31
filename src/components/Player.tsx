import { useEffect, useState } from "react";
import AudioPlayer, { AudioPlayerStatus } from "../logic/AudioPlayer";
import styles from "../styles/Player.module.scss";

export default function Player() {
    const audioPlayer = AudioPlayer.getInstance();
    const [status, setStatus] = useState<AudioPlayerStatus>(audioPlayer.getStatus());

    useEffect(() => {
        audioPlayer.registerCallback(setStatus);

        return () => {
            audioPlayer.unregisterCallback(setStatus);
        }
    }, []);

    // useEffect(() => {

    // }) 

    if (!status.track) {
        return null;
    }

    return (
        <div className={styles.container}>
            
        </div>
    )
}