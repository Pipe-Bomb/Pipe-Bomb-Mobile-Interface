import styles from "../styles/Dock.module.scss";
import iconStyle from "../styles/Icon.module.scss";
import { AiOutlineHome, AiOutlineCompass } from "react-icons/ai";
import { VscLibrary } from "react-icons/vsc";
import { Grid } from "@nextui-org/react";

export default function Dock() {
    return (
        <Grid.Container className={styles.container} justify="space-evenly" alignItems="center">
            <Grid className={iconStyle.icon}>
                <AiOutlineHome />
            </Grid>
            <Grid className={iconStyle.icon}>
                <AiOutlineCompass />
            </Grid>
            <Grid className={iconStyle.icon}>
                <VscLibrary />
            </Grid>
        </Grid.Container>
    )
}