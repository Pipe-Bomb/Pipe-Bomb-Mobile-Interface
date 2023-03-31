import { Loading } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/MiniTile.module.scss";
import Image from "./Image";

export interface MiniTileProps {
    title: string
    image: string | JSX.Element
}

export default function MiniTile({ title, image }: MiniTileProps) {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image src={image} />
            </div>
            <span className={styles.title}>{title}</span>
        </div>
    )
}