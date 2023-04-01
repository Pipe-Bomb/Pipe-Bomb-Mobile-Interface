import styles from "../styles/Dock.module.scss";
import iconStyle from "../styles/Icon.module.scss";
import { AiOutlineHome, AiOutlineCompass } from "react-icons/ai";
import { VscLibrary } from "react-icons/vsc";
import { Grid } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function Dock() {

    return (
        <>
            <Grid.Container className={styles.container} justify="space-evenly" alignItems="center">
                <Grid className={iconStyle.icon}>
                    <Link to="/">
                        <AiOutlineHome />
                    </Link>
                </Grid>
                <Grid className={iconStyle.icon}>
                    <Link to="/explore">
                        <AiOutlineCompass />
                    </Link>
                </Grid>
                <Grid className={iconStyle.icon}>
                    <Link to="/library">
                        <VscLibrary />
                    </Link>
                </Grid>
            </Grid.Container>
        </>
    )
}