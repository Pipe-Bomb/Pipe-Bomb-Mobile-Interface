import { useState } from "react";
import styles from "../styles/PlayerCover.module.scss";
import IconButton from "./IconButton";
import { RxCaretDown } from "react-icons/rx";

let toggleFunction: (value: boolean) => void;

export function setPlayerOpen(open: boolean) {
    toggleFunction(open);
}

export default function PlayerCover() {
    const [isOpen, setIsOpen] = useState(false);

    toggleFunction = setIsOpen;

    return (
        <div className={styles.container + (isOpen ? "" : ` ${styles.closed}`)}>
            <IconButton onPress={() => setIsOpen(false)}>
                <RxCaretDown />
            </IconButton>
        </div>
    )
}