import { Text } from "@nextui-org/react";
import styles from "../styles/SideScroll.module.scss";
import Loader from "./Loader";

export interface SideScrollProps {
    title: string,
    children?: JSX.Element | JSX.Element[] | undefined | null
}

export default function SideScroll({ title, children }: SideScrollProps) {
    return (
        <div className={styles.container}>
            <Text h2 className={styles.title}>{ title }</Text>
            <div className={styles.scrollContainer}>
                <div className={styles.scroll}>
                    { children ? (
                        children
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
    )
}