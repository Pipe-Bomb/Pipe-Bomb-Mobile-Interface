import { Text } from "@nextui-org/react";
import styles from "../styles/Thumbnail.module.scss";
import Image from "./Image";
import { useEffect, useRef } from "react";

export interface ThumbnailProps {
    image: string | JSX.Element,
    title: string,
    subtitle?: string
    small?: boolean,
    onClick?: () => void,
    onHold?: () => void
}

export default function Thumbnail({ image, title, subtitle, small, onClick, onHold}: ThumbnailProps) {
    const classNames = styles.container + (small ? " " + styles.small : "");
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current && onHold) {
            const div = container.current;

            let timer: ReturnType<typeof setTimeout>;

            const touchStart = () => {
                timer = setTimeout(() => {
                    onHold();
                }, 300);
            }

            const touchEnd = () => {
                if (timer) clearTimeout(timer);
            }

            div.addEventListener("touchstart", touchStart);
            div.addEventListener("touchend", touchEnd);
            div.addEventListener("touchmove", touchEnd);
            div.addEventListener("touchcancel", touchEnd);

            return () => {
                div.removeEventListener("touchstart", touchStart);
                div.removeEventListener("touchend", touchEnd);
                div.removeEventListener("touchmove", touchEnd);
                div.removeEventListener("touchcancel", touchEnd);
                touchEnd();
            }
        }
    });

    return (
        <div ref={container} className={classNames} onClick={onClick}>
            <div className={styles.image}>
                <Image src={image} />
            </div>
            <Text h3 className={styles.title}>{title}</Text>
            {subtitle && (
                <Text h4 className={styles.subtitle}>{subtitle}</Text>
            )}
        </div>
    )
}