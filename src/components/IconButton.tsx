import { Button } from "@nextui-org/react";
import { IconContext } from "react-icons";
import iconStyle from "../styles/Icon.module.scss";
import styles from "../styles/IconButton.module.scss";

export interface IconButtonProps {
    children?: JSX.Element
    small?: boolean
}

export default function IconButton({ children, small }: IconButtonProps) {
    return (
        <Button light className={styles.button + (small ? (" " + styles.small) : "")}>
            <IconContext.Provider value={{size: small ? "30px" : "40px"}}>
                { children }
            </IconContext.Provider>
        </Button>
    )
}