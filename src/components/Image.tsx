import { Loading } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Image.module.scss";

export interface ImageProps {
    src: string | JSX.Element
}

export default function Image({ src }: ImageProps) {
    const [hasImage, setHasImage] = useState(false);
    const thumbnail = useRef(null);

    useEffect(() => {
        const element: any = thumbnail.current;
        if (!element) return;
        element.onload = () => {
            setHasImage(true);
        }
        element.src = src;
    }, [src]);

    return (
        <div className={styles.imageContainer}>
            {typeof src == "string" ? (
                <>
                    <img ref={thumbnail} style={{display: hasImage ? "block" : "none"}} />
                    {!hasImage && (
                        <Loading loadingCss={{ $$loadingSize: "40px", $$loadingBorder: "calc(500% / 60)" }} css={{margin: "10px"}} />
                    )}
                </>
            ) : (
                src
            )}
        </div>
    )
}