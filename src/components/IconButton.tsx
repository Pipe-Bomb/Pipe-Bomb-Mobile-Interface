import { Button } from "@nextui-org/react";
import iconStyle from "../styles/Icon.module.scss";
import styles from "../styles/IconButton.module.scss";

export interface IconButtonProps {
    children?: JSX.Element
    small?: boolean
}

export default function IconButton({ children, small }: IconButtonProps) {
    console.log("button");
    return (
        <Button light className={styles.button + (small ? (" " + styles.small) : "")}>
            { children }
        </Button>
    )
}