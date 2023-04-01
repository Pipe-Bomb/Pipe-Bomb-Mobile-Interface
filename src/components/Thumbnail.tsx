import { Text } from "@nextui-org/react";
import styles from "../styles/Thumbnail.module.scss";
import Image from "./Image";

export interface ThumbnailProps {
    image: string | JSX.Element,
    title: string,
    subtitle?: string
    small?: boolean,
    onClick?: () => void
}

export default function Thumbnail({ image, title, subtitle, small, onClick}: ThumbnailProps) {
    const classNames = styles.container + (small ? " " + styles.small : "");

    return (
        <div className={classNames} onClick={onClick}>
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