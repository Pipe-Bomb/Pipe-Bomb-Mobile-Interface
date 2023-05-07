import { useEffect, useRef, useState } from "react";
import styles from "../styles/Image.module.scss"
import { Loading } from "@nextui-org/react";

export interface ImageProps {
    src: string | JSX.Element | undefined,
    fallback?: string,
    loadingSize?: "xs" | "sm" | "md" | "lg" | "xl",
    border?: boolean
}

export default function Image({src, fallback, loadingSize, border}: ImageProps) {
    const image = useRef<HTMLImageElement>(null);
    const [loading, setLoading] = useState(true);
    const [activeSrc, setActiveSrc] = useState("");

    useEffect(() => {
        if (!image.current || typeof src != "string") return;

        image.current.src = src;
        setActiveSrc(image.current.src);
    }, [src]);

    function loadError() {
        if (!image.current) return;
        const newSrc = fallback || "/no-album-art.png";
        setActiveSrc(newSrc);
    }

    function loadSuccess() {
        
        if (activeSrc == "/no-album-art.png") {
            console.log("load ended!");
        }
        setLoading(false);
        if (!image.current) return;
        setActiveSrc(image.current.src);
    }

    if (typeof src != "string") {
        return (
            <div className={styles.container}>
                { src }
            </div>
        )
    }

    return (
        <div className={styles.container + (loading ? ` ${styles.loadingContainer}` : "") + (border ? ` ${styles.border}` : "")}>
            {loading && (
                <Loading className={styles.loading} size={loadingSize || "xl"} />
            )}
            
            <img ref={image} className={styles.image} src={activeSrc} onLoadStart={() => setLoading(true)} onError={loadError} onLoad={loadSuccess} />
        </div>
        
    )
}