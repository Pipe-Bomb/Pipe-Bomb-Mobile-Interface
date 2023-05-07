import { useState } from "react";
import styles from "../styles/ContextMenu.module.scss";
import { Button, Text } from "@nextui-org/react";

let setMenuOpen: (open: boolean) => void;

export interface ContextMenuEntry {
    icon: JSX.Element,
    name: string,
    disabled?: boolean
    onPress: () => boolean
}

export interface ContextMenuInfo {
    title: string,
    subtitle: string,
    image?: JSX.Element | null,
    options: ContextMenuEntry[]
}

let contextMenuInfo: ContextMenuInfo;

export function openContextMenu(info: ContextMenuInfo) {
    if (setMenuOpen) {
        contextMenuInfo = info;
        window.navigator.vibrate(20);
        setMenuOpen(true);
    }
}

export default function ContextMenu() {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    setMenuOpen = setOpen;

    function close() {
        setClosing(true);
        setOpen(false);
        setTimeout(() => {
            setClosing(false);
        }, 50);
    }

    function tap(e: React.TouchEvent) {
        e.stopPropagation();

        document.addEventListener("touchend", close, { once: true });
    }

    function runAction(action: () => boolean) {
        if (!action()) close();
    }

    return (
        <div className={open ? styles.open : ""}>
            <div className={styles.background + (closing ? ` ${styles.closing}` : "")} onTouchStart={tap}></div>
            <div className={styles.container}>
                <div className={styles.header}>
                    {contextMenuInfo?.image && (
                        <div className={styles.image}>
                            {contextMenuInfo.image}
                        </div>
                    )}
                    <div className={styles.info}>
                        <Text h3>{contextMenuInfo?.title}</Text>
                        {contextMenuInfo?.subtitle && (
                            <Text h4>{contextMenuInfo.subtitle}</Text>
                        )}
                    </div>
                </div>
                {contextMenuInfo?.options.map((data, index) => (
                    <Button key={index} disabled={data.disabled} className={styles.button} onPress={() => runAction(data.onPress)} light size="lg"><span className={styles.icon}>{data.icon}</span> {data.name}</Button>
                ))}
            </div>
        </div>
    )
}