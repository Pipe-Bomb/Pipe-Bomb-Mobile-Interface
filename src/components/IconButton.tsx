import { Button } from "@nextui-org/react";
import { IconContext } from "react-icons";
import iconStyle from "../styles/Icon.module.scss";
import styles from "../styles/IconButton.module.scss";

export interface IconButtonProps {
    children?: JSX.Element
    small?: boolean,
    onPress?: () => void
}

export default function IconButton({ children, small, onPress }: IconButtonProps) {
    return (
        <Button light className={styles.button + (small ? (" " + styles.small) : "")} onPress={onPress}>
            <IconContext.Provider value={{size: small ? "30px" : "40px"}}>
                { children }
            </IconContext.Provider>
        </Button>
    )
}